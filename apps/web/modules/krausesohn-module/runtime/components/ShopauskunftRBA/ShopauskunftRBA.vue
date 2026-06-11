<template>
  <client-only>
    <div class="shopauskunft-widget-container" />
  </client-only>
</template>
<script setup lang="ts">
import type { shopauskunftPropsType } from '#krause/components/ShopauskunftRBA/types';
import { orderGetters } from '@plentymarkets/shop-api';

const props = defineProps<shopauskunftPropsType>();

declare global {
  interface Window {
    xc_label?: string
    fetched_data?: Record<string, unknown>
  }
}

const shopauskunftId = ref('S00036055');
const companyName = ref('Krause & Sohn GmbH');

const isInitialized = ref(false)

const loadScript = () => {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-shopauskunft-rba]'
    )

    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://rba.shopauskunft.de/js/rba_widget.js'
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute('data-shopauskunft-rba', 'true')

    //script.onload = () => resolve()
    script.onerror = () => reject(new Error('Shopauskunft RBA Script konnte nicht geladen werden'))

    script.onload = () => {
      window.initWidget?.(window.fetched_data)
    }

    document.body.appendChild(script)
  })
}

const initShopauskunftRba = async () => {
  if (isInitialized.value || !import.meta.client) return

  const orderId = orderGetters.getId(props.order)
  const email = orderGetters.getOrderEmail(props.order)

  if (!orderId || !email) {
    console.warn('Shopauskunft RBA: orderId oder email fehlt', {
      orderId,
      email,
    })
    return
  }

  window.xc_label = shopauskunftId.value

  window.fetched_data = {
    xc_label: shopauskunftId.value,
    shop_name: companyName.value,
    email: orderGetters.getOrderEmail(props.order),
    shop_type: '12',
    order_id: orderGetters.getId(props.order),
    order_value: orderGetters.getTotals(props.order).itemSumGross,
    shipping_value: orderGetters.getShippingCost(props.order),
    language: 'de',
    url: window.location.origin,
    token: 'IEqggoqlBJdA/gCRrKsRmQ'
  }

  await loadScript()

  isInitialized.value = true
}

onMounted(() => {
  initShopauskunftRba()
})
</script>
