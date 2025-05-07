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



declare global {
  interface Window {
    _paq: any[];
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  const { consent: cookieConsent } = useCookieConsent('matomo_consent'); // Verwenden Sie einen passenden CookieName
  const matomoConsentGiven = useState<boolean>('matomoConsentGiven', () => cookieConsent.value);
  const { add: registerCookie } = useRegisterCookie();
  const router = useRouter();
  const cookieGroup = 'CookieBar.marketing.label';

  if (!config.matomoUrl || !config.matomoId || !import.meta.client) {
    return;
  }

  window._paq = window._paq || [];

  if (config.matomoDebug) {
    window._paq.push(['enableJSErrorTracking']);
  }

  if (config.matomoDisableCookies) {
    window._paq.push(['disableCookies']);
  }

  watch(cookieConsent, (value) => {
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
      window._paq.push(['setTrackerUrl', `${config.matomoUrl}/matomo.php`]);
      window._paq.push(['setSiteId', config.matomoId]);
      window._paq.push(['setExcludedQueryParams', ['ReferrerID']]);
      window._paq.push(['enableLinkTracking']);

      const script = document.createElement('script');
      script.type = "text/javascript"
      script.textContent = matomoScriptContent;
      document.head.appendChild(script);
    } else {
      // Optional: Entfernen Sie das Skript, falls Consent widerrufen wird
      const existingScript = document.querySelector(`script[src="${config.matomoUrl}/matomo.js"]`);
      if (existingScript) {
        existingScript?.remove();
      }
    }
  }, { immediate: true });

  router.afterEach((to) => {
    if (matomoConsentGiven.value && window._paq) {
      window._paq.push(['setCustomUrl', config.url + to.fullPath]);
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
        config.matomoShowGrossPrices ? order.totals.totalGross : order.totals.totalNet, // grandTotal
        order.order.orderItems.map((item) => config.showGrossPrices ? orderGetters.getItemPrice(item) : orderGetters.getItemNetPrice(item)).reduce((sum, price) => sum + price, 0), // subtotal (sum of item prices)
        config.matomoShowGrossPrices ? order.totals.shippingGross : order.totals.shippingNet, // shippingCost
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
      window._paq.push(['trackEcommerceCartUpdate', config.matomoShowGrossPrices ? data.basketAmount : data.basketAmountNet]);
    }
  });

  on('frontend:productLoaded', ( data) => {
    window._paq.push(['trackEcommerceProductView',
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
