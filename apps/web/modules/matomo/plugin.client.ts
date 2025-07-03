// modules/matomo/plugin.client.ts
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useState, watch,
  useCookieConsent,
  useRouter,
  usePlentyEvent
} from '#imports';
import { cartGetters, orderGetters, productGetters } from '@plentymarkets/shop-api';

import matomoScriptContent from '~/modules/matomo/runtime/matomo.js?raw';
import { computed } from 'vue';



declare global {
  interface Window {
    _paq: any[];
  }
}

export default defineNuxtPlugin(() => {
  const { getSetting: getMatomoUrl } = useSiteSettings('matomoUrl');
  const matomoUrl = computed(() => getMatomoUrl() );
  const { getSetting: getMatomoId } = useSiteSettings('matomoId');
  const matomoId = computed(() => getMatomoId() );

  const { consent } = useCookieConsent('matomo_consent'); // Verwenden Sie einen passenden CookieName
  const matomoConsentGiven = useState<boolean>('matomoConsentGiven', () => consent.value);
  const router = useRouter();

  /*
  if (!config.matomoUrl || !config.matomoId || !import.meta.client) {
    return;
  }*/

  window._paq = window._paq || [];

  /**
  if (matomoDebug) {
    window._paq.push(['enableJSErrorTracking']);
  }

  if (matomoDisableCookies) {
    window._paq.push(['disableCookies']);
  }*/

  watch(consent, (value) => {
    matomoConsentGiven.value = value;
    if (window._paq) {
      if (value) {
        window._paq.push(['rememberCookieConsentGiven']);
        window._paq.push(['rememberConsentGiven']);
      } else {
        window._paq.push(['forgetCookieConsentGiven']);
        window._paq.push(['forgetConsentGiven']);
      }
    }
  }, { immediate: true });

  watch(matomoConsentGiven, (consentGiven) => {
    if (consentGiven) {
      window._paq.push(['setTrackerUrl', `${matomoUrl}/matomo.php`]);
      window._paq.push(['setSiteId', matomoId]);
      window._paq.push(['setExcludedQueryParams', ['ReferrerID']]);
      window._paq.push(['enableLinkTracking']);

      const script = document.createElement('script');
      script.type = "text/javascript"
      script.textContent = matomoScriptContent;
      document.head.appendChild(script);
    } else {
      // Optional: Entfernen Sie das Skript, falls Consent widerrufen wird
      const existingScript = document.querySelector(`script[src="${matomoUrl}/matomo.js"]`);
      if (existingScript) {
        existingScript?.remove();
      }
    }
  }, { immediate: true });

  router.afterEach((to) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['setCustomUrl',  to.fullPath]);
      document.title = to.meta.title as string || document.title;
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  });

  const { on } = usePlentyEvent()
  // Matomo Event Tracking based on Plenty Events

  on('frontend:orderCreated', (order) => {
    if (matomoConsentGiven.value && window._paq && order.order && order.totals) {
      const totalVat = order.totals.vats.reduce((acc: number, vat: { value: number }) => acc + vat.value, 0);
      window._paq.push(['trackEcommerceOrder',
        orderGetters.getId(order), // orderId
        order.totals.totalNet, // grandTotal
        order.order.orderItems.map((item) => orderGetters.getItemNetPrice(item)).reduce((sum, price) => sum + price, 0), // subtotal (sum of item prices)
        order.totals.shippingNet, // shippingCost
        totalVat, // taxAmount
        false // discountAmount (not easily available here, might need adjustment)
      ]);
      order.order.orderItems.forEach((item) => {
        window._paq.push(['addEcommerceItem',
          orderGetters.getItemVariationId(item), // itemSKU
          orderGetters.getItemName(item), // itemName
          '', // itemCategory (not easily available here)
          orderGetters.getItemNetPrice(item),
          orderGetters.getItemQty(item) // quantity
        ]);
      });
    }
  });


  on('frontend:addToCart', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['trackEcommerceCartUpdate', data.cart.basketAmountNet]);
      window._paq.push(['addEcommerceItem',
        cartGetters.getVariationId(data.item), // itemSKU
        cartGetters.getItemName(data.item), // itemName
        '', // itemCategory (not easily available here)
        cartGetters.getItemPrice(data.item), // price
        data.addItemParams.quantity // quantity
      ]);
    }
  });


  on('frontend:removeFromCart', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['removeEcommerceItem', data.deleteItemParams.cartItemId]);
      window._paq.push(['trackEcommerceCartUpdate', cartGetters.getTotals(data.cart)]);
    }
  });

  on('frontend:beginCheckout', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['trackEvent', 'Checkout', 'Begin Checkout']);
      data?.items?.forEach(item => {
        window._paq.push(['addEcommerceItem',
          cartGetters.getVariationId(item),
          cartGetters.getItemName(item),
          '',
          cartGetters.getItemPrice(item),
          cartGetters.getItemQty(item)
        ]);
      });
      window._paq.push(['trackEcommerceCartUpdate', data.basketAmountNet]);
    }
  });

  on('frontend:productLoaded', ( data) => {
    window._paq.push(['setEcommerceView',
      productGetters.getVariationId(data.product),
      productGetters.getName(data.product),
      '',
      productGetters.getPrice(data.product)
    ]);
  });

  on('frontend:addToWishlist', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['trackEvent', 'Wishlist', 'Add To Wishlist', data.variationId]);
    }
  });

  on('frontend:signUp', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['trackEvent', 'User', 'Sign Up', data.method]);
    }
  });

  on('frontend:login', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['trackEvent', 'User', 'Login', data.method]);
    }
  });

  on('frontend:searchProduct', (data) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['trackSiteSearch', data]);
    }
  });

});
