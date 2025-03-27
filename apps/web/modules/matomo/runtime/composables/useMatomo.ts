// modules/matomo/runtime/composables/useMatomo.ts
import { useNuxtApp, useRuntimeConfig, useRoute } from '#imports';

export const useMatomo = () => {
  const config = useRuntimeConfig().public.matomo;
  const route = useRoute();
  const { $matomoEcommerce } = useNuxtApp();
  const matomoConsentGiven = useState<boolean>('matomoConsentGiven');

  const trackPageView = (documentTitle?: string, customUrl?: string) => {
    if (process.client && window._paq && config?.enabled && matomoConsentGiven.value) {
      if (customUrl) {
        window._paq.push(['setCustomUrl', customUrl]);
      } else {
        window._paq.push(['setCustomUrl', config.url + route.fullPath]);
      }
      if (documentTitle) {
        window._paq.push(['setDocumentTitle', documentTitle]);
      } else {
        window._paq.push(['setDocumentTitle', document.title]);
      }
      window._paq.push(['trackPageView']);
    }
  };

  const trackSearch = (keyword: string, category?: string) => {
    if (process.client && window._paq && config?.enabled && config?.trackSiteSearch && matomoConsentGiven.value) {
      window._paq.push(['trackSiteSearch', keyword, category]);
    }
  };

  return {
    trackPageView,
    trackSearch,
  };
};

export const useMatomoEcommerce = () => {
  const config = useRuntimeConfig().public.matomo;
  const matomoConsentGiven = useState<boolean>('matomoConsentGiven');

  if (!process.client || !window._paq || !config?.enabled || !config?.trackEcommerce || !matomoConsentGiven.value) {
    return {
      addEcommerceItem: () => {},
      removeEcommerceItem: () => {},
      trackCartUpdate: () => {},
      trackEcommerceOrder: () => {},
      trackAddToCart: () => {},
      trackRemoveFromCart: () => {},
    };
  }

  return {
    addEcommerceItem: (id: string, name: string, category: string = '', price: number, quantity: number) => {
      window._paq.push(['addEcommerceItem', id, name, category, price, quantity]);
    },
    removeEcommerceItem: (id: string) => {
      window._paq.push(['removeEcommerceItem', id]);
    },
    trackCartUpdate: (grandTotal: number) => {
      window._paq.push(['trackEcommerceCartUpdate', grandTotal]);
    },
    trackEcommerceOrder: (orderId: string, grandTotal: number, subTotal?: number, tax?: number, shipping?: number, discount?: number, items?: [string, string, string | undefined, number, number][]) => {
      window._paq.push(['trackEcommerceOrder', orderId, grandTotal, subTotal, tax, shipping, discount, items]);
    },
    trackAddToCart: () => {
      window._paq.push(['trackAddToCart']);
    },
    trackRemoveFromCart: (id: string) => {
      console.warn('useMatomoEcommerce: trackRemoveFromCart sollte in der Regel in Kombination mit removeEcommerceItem verwendet werden.');
      window._paq.push(['removeEcommerceItem', id]);
    },
  };
};
