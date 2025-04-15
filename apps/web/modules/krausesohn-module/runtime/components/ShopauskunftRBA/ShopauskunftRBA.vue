<template>
  <div class="shopauskunft-widget-container"></div>
</template>
<script setup lang="ts">
import type { shopauskunftPropsType } from '~/modules/krausesohn-module/runtime/components/ShopauskunftRBA/types';
import { orderGetters } from '@plentymarkets/shop-api';

const props = defineProps<shopauskunftPropsType>();

const shopauskunftId = ref('S00036055');
const companyName = ref('Krause & Sohn GmbH');

onMounted(() => {
  const xcLabel = shopauskunftId.value;
  const fetchData = {
    xc_label: xcLabel,
    shop_name: companyName.value,
    email: orderGetters.getOrderEmail(props.order),
    shop_type: '12',
    order_id: orderGetters.getId(props.order),
    order_value: orderGetters.getTotals(props.order).itemSumGross,
    shipping_value: orderGetters.getShippingCost(props.order),
    language: 'de',
    url: window.location.origin,
    token: 'IEqggoqlBJdA/gCRrKsRmQ'
  };

  const scriptContent = `
  var xc_label = '${xcLabel}';
  var fetched_data = ${JSON.stringify(fetchData)};
`;

  useHead({
    script: [
      {
        type: "text/javascript",
        innerHTML: scriptContent,
      },
      {
        type: 'text/javascript',
        src: 'https://rba.shopauskunft.de/js/rba_widget.js',
        async: true,
      },
    ]
  });
});
</script>
