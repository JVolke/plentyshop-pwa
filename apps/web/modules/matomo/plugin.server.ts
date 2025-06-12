// modules/matomo/plugin.server.ts
import { defineNuxtPlugin, useRuntimeConfig, useCookieConsent, useRegisterCookie } from '#imports';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  const { consent  } = useCookieConsent('matomo_consent'); // Verwenden Sie denselben CookieName wie im Client
  const { add: registerCookie } = useRegisterCookie();
  const cookieGroup = 'CookieBar.marketing.label';

  // Cookie Registration (only on server)
  if (cookieGroup) {
    registerCookie({
      name: 'matomo_consent', // Verwenden Sie denselben CookieName wie oben
      Provider: 'Krause & Sohn GmbH', // Passenden Provider definieren
      Status: 'Der Cookie wird zur Analyse des Nutzungsverhaltens genutzt.', // Passenden Status definieren
      PrivacyPolicy: 'https://www.krause-sohn.de/privacy-policy', // Link zur Matomo-Datenschutzerklärung
      Lifespan: 'Session', // Typische Lebensdauer von Matomo-Cookies
      cookieNames: ['/_pk_id/', '_pk_ses/', 'mtm_consent', 'mtm_consent_removed'],
      accepted: false, // Initialwert auf false setzen, da Zustimmung erforderlich ist
    }, cookieGroup);
  }
});
