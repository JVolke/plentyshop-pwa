// modules/matomo/plugin.client.ts
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useState, watch,
  useCookieConsent,
  useRouter,
  usePlentyEvent
} from '#imports'
import { cartGetters, orderGetters, productGetters } from '@plentymarkets/shop-api'
import matomoScriptContent from '~/modules/matomo/runtime/matomo.js?raw'

declare global { interface Window { _paq: any[] } }

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const router = useRouter()

  // Read consent flag from your cookie banner
  const { consent } = useCookieConsent('matomo_consent')
  const matomoConsentGiven = useState<boolean>('matomoConsentGiven', () => Boolean(consent.value))

  // Parse consent mode from runtime config:
  //  - 'cookie'   -> track WITHOUT cookies until consent (requireCookieConsent)
  //  - 'tracking' -> do not track at all until consent (requireConsent)
  //  - anything else / empty -> track normally (not recommended if you need consent)
  const rawRequire = (config.matomoRequireConsent ?? '').toString().toLowerCase()
  const consentMode: 'cookie'|'tracking'|'off' =
    rawRequire === 'cookie' ? 'cookie'
      : (rawRequire === '1' || rawRequire === 'true' || rawRequire === 'tracking') ? 'tracking'
        : 'off'
  const allowCookieless = consentMode === 'cookie'

  // --- Matomo bootstrap MUST happen immediately (not gated by consent) ---
  window._paq = window._paq || []

  if (config.matomoDebug) {
    window._paq.push(['enableJSErrorTracking'])
  }

  if (config.matomoDisableCookies) {
    // Optional: hard-disable cookies even after consent
    window._paq.push(['disableCookies'])
  }

  // Set consent strategy commands BEFORE any tracking calls
  if (consentMode === 'cookie') {
    // Track cookieless until consent is given
    window._paq.push(['requireCookieConsent'])
  } else if (consentMode === 'tracking') {
    // Do not track anything until consent
    window._paq.push(['requireConsent'])
  }

  // Initialize tracker and inject script immediately
  if (config.matomoUrl && config.matomoId) {
    window._paq.push(['setTrackerUrl', `${config.matomoUrl}/matomo.php`])
    window._paq.push(['setSiteId', config.matomoId])
    window._paq.push(['setExcludedQueryParams', ['ReferrerID']])
    window._paq.push(['enableLinkTracking'])

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.textContent = matomoScriptContent
    document.head.appendChild(script)
  }

  // Consent watcher: only remember/forget, do NOT add/remove the script
  watch(consent, (value) => {
    matomoConsentGiven.value = Boolean(value)
    if (!window._paq) return
    if (value) {
      window._paq.push(['rememberCookieConsentGiven'])
      window._paq.push(['rememberConsentGiven'])
    } else {
      window._paq.push(['forgetCookieConsentGiven'])
      window._paq.push(['forgetConsentGiven'])
    }
  }, { immediate: true })

  // Helper for all events
  const canTrackNow = () => (matomoConsentGiven.value || allowCookieless) && Boolean(window._paq)

  // Track first pageview if there is no route change on initial load
  queueMicrotask(() => {
    if (canTrackNow()) {
      window._paq.push(['setCustomUrl', location.pathname + location.search + location.hash])
      window._paq.push(['setDocumentTitle', document.title])
      if (config.matomoTrackPageView) window._paq.push(['trackPageView'])
    }
  })

  // SPA route changes
  router.afterEach((to) => {
    if (canTrackNow()) {
      window._paq.push(['setCustomUrl', to.fullPath])
      document.title = (to.meta.title as string) || document.title
      window._paq.push(['setDocumentTitle', document.title])
      if (config.matomoTrackPageView) window._paq.push(['trackPageView'])
    }
  })

  // Plenty events
  const { on } = usePlentyEvent()

  on('frontend:orderCreated', (order: any) => {
    if (!canTrackNow() || !order?.order || !order?.totals) return

    // Add each item first
    order.order.orderItems.forEach((item: any) => {
      window._paq.push(['addEcommerceItem',
        orderGetters.getItemVariationId(item),
        orderGetters.getItemName(item),
        '',
        orderGetters.getItemNetPrice(item),
        orderGetters.getItemQty(item)
      ])
    })

    const subtotal = order.order.orderItems
      .map((item: any) => orderGetters.getItemNetPrice(item))
      .reduce((sum: number, price: number) => sum + price, 0)

    const totalVat = (order.totals.vats || [])
      .reduce((acc: number, vat: { value: number }) => acc + vat.value, 0)

    window._paq.push(['trackEcommerceOrder',
      orderGetters.getId(order),         // orderId
      order.totals.totalNet,             // revenue
      subtotal,                          // subtotal
      order.totals.shippingNet,          // shipping
      totalVat                           // tax
    ])
  })

  on('frontend:addToCart', (data: any) => {
    if (!canTrackNow()) return
    window._paq.push(['trackEcommerceCartUpdate', data.cart.basketAmountNet])
    window._paq.push(['addEcommerceItem',
      cartGetters.getVariationId(data.item),
      cartGetters.getItemName(data.item),
      '',
      cartGetters.getItemPrice(data.item),
      data.addItemParams.quantity
    ])
  })

  on('frontend:removeFromCart', (data: any) => {
    if (!canTrackNow()) return
    window._paq.push(['removeEcommerceItem', data.deleteItemParams.cartItemId])
    window._paq.push(['trackEcommerceCartUpdate', cartGetters.getTotals(data.cart)])
  })

  on('frontend:productLoaded', (data: any) => {
    if (!canTrackNow()) return
    window._paq.push(['setEcommerceView',
      productGetters.getVariationId(data.product),
      productGetters.getName(data.product),
      '',
      productGetters.getPrice(data.product)
    ])
  })

  on('frontend:addToWishlist', (data: any) => {
    if (!canTrackNow()) return
    window._paq.push(['trackEvent', 'Wishlist', 'Add To Wishlist', data.variationId])
  })

  on('frontend:signUp', (data: any) => {
    if (!canTrackNow()) return
    window._paq.push(['trackEvent', 'User', 'Sign Up', data.method])
  })

  on('frontend:login', (data: any) => {
    if (!canTrackNow()) return
    window._paq.push(['trackEvent', 'User', 'Login', data.method])
  })

  on('frontend:searchProduct', (data: any) => {
    if (!canTrackNow()) return
    if (config.matomoTrackSiteSearch) window._paq.push(['trackSiteSearch', data])
  })
})
