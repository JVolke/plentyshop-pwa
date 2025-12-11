// modules/matomo/runtime/composables/useMatomo.ts
import { useNuxtApp, useRuntimeConfig, useRoute } from '#imports';

export const useMatomo = () => {
  const config = useRuntimeConfig().public;
  const route = useRoute();
  const { $matomoEcommerce } = useNuxtApp();

  const canTrack = () =>
    import.meta.client &&
    typeof window !== 'undefined' &&
    Array.isArray(window._paq) &&
    config?.matomoEnabled !== false;

  const trackPageView = (documentTitle?: string, customUrl?: string) => {
    if (!canTrack()) return;

    if (customUrl) {
      window._paq.push(['setCustomUrl', customUrl]);
    } else {
      window._paq.push(['setCustomUrl', route.fullPath]);
    }

    if (documentTitle) {
      window._paq.push(['setDocumentTitle', documentTitle]);
    }

    window._paq.push(['trackPageView']);
  };

  const trackSearch = (keyword: string, category?: string) => {
    if (!canTrack() || !config?.matomoTrackSiteSearch) return;
    window._paq.push(['trackSiteSearch', keyword, category]);
  };

  return {
    trackPageView,
    trackSearch,
  };
};

export const useMatomoEcommerce = () => {
  const config = useRuntimeConfig().public;

  if (!import.meta.client || !window._paq || !config?.matomoEnabled || !config?.matomoTrackEcommerce) {
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
      window._paq.push(['removeEcommerceItem', id]);
    },
  };
};
