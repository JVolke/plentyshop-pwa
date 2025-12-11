// modules/matomo/plugin.client.ts
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useRouter,
  usePlentyEvent
} from '#imports'
import { cartGetters, orderGetters, productGetters } from '@plentymarkets/shop-api'
import matomoScriptContent from '#matomo/matomo.js?raw'

declare global { interface Window { _paq: any[] } }

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const router = useRouter()

  window._paq = window._paq || []

  if (config.matomoDebug) {
    window._paq.push(['enableJSErrorTracking'])
  }

  // Initialize tracker and inject script immediately
  if (config.matomoUrl && config.matomoId) {
    window._paq.push(['disableCookies'])
    window._paq.push(['setTrackerUrl', `${config.matomoUrl}/matomo.php`])
    window._paq.push(['setSiteId', config.matomoId])
    window._paq.push(['setExcludedQueryParams', ['ReferrerID']])
    window._paq.push(['enableLinkTracking'])

    const script = document.createElement('script')
    script.type = 'text/javascript'
    //script.textContent = matomoScriptContent
    script.src = "https://statistik.krause-sohn.de/matomo.js"
    document.head.appendChild(script)
  }


  // Helper for all events
  const canTrack = () =>
    typeof window !== 'undefined' &&
    Array.isArray(window._paq) &&
    config?.matomoEnabled !== false

  // Track first pageview if there is no route change on initial load
  queueMicrotask(() => {
    if (canTrack()) {
      window._paq.push(['setCustomUrl', location.pathname + location.search + location.hash])
      window._paq.push(['setDocumentTitle', document.title])
      if (config.matomoTrackPageView) window._paq.push(['trackPageView'])
    }
  })

  // SPA route changes
  router.afterEach((to) => {
    if (canTrack()) {
      window._paq.push(['setCustomUrl', to.fullPath])
      document.title = (to.meta.title as string) || document.title
      window._paq.push(['setDocumentTitle', document.title])
      if (config.matomoTrackPageView) window._paq.push(['trackPageView'])
    }
  })

  // Plenty events
  const { on } = usePlentyEvent()

  on('frontend:orderCreated', (order: any) => {
    if (!canTrack() || !order?.order || !order?.totals) return

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
    if (!canTrack()) return
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
    if (!canTrack()) return
    window._paq.push(['removeEcommerceItem', data.deleteItemParams.cartItemId])
    window._paq.push(['trackEcommerceCartUpdate', cartGetters.getTotals(data.cart)])
  })

  on('frontend:productLoaded', (data: any) => {
    if (!canTrack()) return
    window._paq.push(['setEcommerceView',
      productGetters.getVariationId(data.product),
      productGetters.getName(data.product),
      '',
      productGetters.getPrice(data.product)
    ])
  })

  on('frontend:addToWishlist', (data: any) => {
    if (!canTrack()) return
    window._paq.push(['trackEvent', 'Wishlist', 'Add To Wishlist', data.variationId])
  })

  on('frontend:signUp', (data: any) => {
    if (!canTrack()) return
    window._paq.push(['trackEvent', 'User', 'Sign Up', data.method])
  })

  on('frontend:login', (data: any) => {
    if (!canTrack()) return
    window._paq.push(['trackEvent', 'User', 'Login', data.method])
  })

  on('frontend:searchProduct', (data: any) => {
    if (!canTrack()) return
    if (config.matomoTrackSiteSearch) window._paq.push(['trackSiteSearch', data])
  })
})
