<template>
  <ClientOnly>
    <div
      v-if="showStockHint"
      class="text-orange-800"
    >
      Nur noch {{ stock }} Stück verfügbar
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  variationId: number | string
}>()

const { data } = await useFetch<{ stock: number }>('/rest/getStock', {
  query: {
    variationId: props.variationId,
  },
  server: false,
})

const stock = computed(() => data.value?.stock ?? 0)

const showStockHint = computed(() => {
  return stock.value > 0 && stock.value < 10
})
</script>
