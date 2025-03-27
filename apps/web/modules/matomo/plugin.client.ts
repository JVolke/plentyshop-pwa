// modules/matomo/plugin.client.ts
import { defineNuxtPlugin, useRuntimeConfig, useState, watch, useRouter } from '#imports';

declare global {
  interface Window {
    _paq: any[];
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.matomo;
  const router = useRouter();

  if (!config.url || !config.id || !process.client) {
    return;
  }

  window._paq = window._paq || [];

  if (config.debug) {
    window._paq.push(['enableJSErrorTracking']);
  }

  if (config.disableCookies) {
    window._paq.push(['disableCookies']);
  }

  // Zustand für den Cookie-Consent
  const matomoConsentGiven = useState<boolean>('matomoConsentGiven', () => !config.requireConsent);

  if (config.requireConsent && process.client) {
    const getMarketingConsent = () => {
      return document.cookie.includes('marketing_consent=true');
    };

    matomoConsentGiven.value = getMarketingConsent();

    window.addEventListener('cookieConsentChanged', (event: any) => {
      if (event?.detail?.marketing) {
        matomoConsentGiven.value = true;
        window._paq?.push(['rememberCookieConsentGiven']);
        window._paq?.push(['rememberSessionCookieConsentGiven']);
      } else {
        matomoConsentGiven.value = false;
        window._paq?.push(['forgetCookieConsentGiven']);
        window._paq?.push(['forgetSessionCookieConsentGiven']);
      }
    });

    watch(matomoConsentGiven, (newConsent) => {
      if (window._paq) {
        if (newConsent) {
          window._paq.push(['rememberCookieConsentGiven']);
          window._paq.push(['rememberSessionCookieConsentGiven']);
        } else {
          window._paq.push(['forgetCookieConsentGiven']);
          window._paq.push(['forgetSessionCookieConsentGiven']);
        }
      }
    }, { immediate: true });

    window._paq.push(['requireCookieConsent']);
    window._paq.push(['requireSessionCookieConsentGiven']);
  } else if (process.client && window._paq) {
    window._paq.push(['rememberCookieConsentGiven']);
    window._paq.push(['rememberSessionCookieConsentGiven']);
  }

  const trackerUrl = `${config.url}/matomo.php`;
  window._paq.push(['setTrackerUrl', trackerUrl]);
  window._paq.push(['setSiteId', config.id]);
  window._paq.push(['setExcludedQueryParams', ['ReferrerID']]); // Hinzufügen dieser Zeile
  window._paq.push(['enableLinkTracking']);

  // Initial Page View Tracking nur, wenn nicht explizit deaktiviert
  if (config.trackPageView !== false) {
    router.afterEach((to) => {
      if (matomoConsentGiven.value && window._paq) {
        window._paq.push(['setCustomUrl', config.url + to.fullPath]);
        document.title = to.meta.title as string || document.title; // Versuchen, Meta-Title zu verwenden
        window._paq.push(['setDocumentTitle', document.title]);
        window._paq.push(['trackPageView']);
      }
    });
  }

  // Inject Matomo script asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = `${config.url}/matomo.js`;
  document.head.appendChild(script);
});
