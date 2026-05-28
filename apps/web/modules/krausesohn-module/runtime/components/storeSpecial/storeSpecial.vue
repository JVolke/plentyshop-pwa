<template>
  <div
    v-if="storeSpecialName"
    :class="badgeClasses"
  >
    {{ badgeText }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: any
  inCategory?: boolean
}>()

const storeSpecialName = computed(() => {
  return props.product?.item?.storeSpecial?.names?.name ?? ''
})

const defaultPrice = computed(() => {
  return Number(props.product?.prices?.default?.price?.value ?? 0)
})

const rrpPrice = computed(() => {
  return Number(props.product?.prices?.rrp?.price?.value ?? 0)
})

const discountPercent = computed(() => {
  if (
    storeSpecialName.value !== 'Sonderangebot' ||
    !rrpPrice.value ||
    !defaultPrice.value ||
    rrpPrice.value <= defaultPrice.value
  ) {
    return null
  }

  return Math.round(
    ((rrpPrice.value - defaultPrice.value) / rrpPrice.value) * 100
  )
})

const badgeText = computed(() => {
  switch (storeSpecialName.value) {
    case 'Neuheit':
      return 'Neu'

    case 'Sonderangebot':
      return discountPercent.value
        ? `-${discountPercent.value}%`
        : '%'

    default:
      return storeSpecialName.value
  }
})

const badgeColorClasses = computed(() => {
  return storeSpecialName.value === 'Sonderangebot'
    ? 'bg-red-600 text-white'
    : 'bg-primary-500 text-white'
})

const badgeClasses = computed(() => {
  const baseClasses = `${badgeColorClasses.value} rounded px-2 py-1 text-xs font-semibold`

  return props.inCategory
    ? `absolute left-2 top-2 z-10 ${baseClasses}`
    : `inline-flex w-fit ${baseClasses}`
})
</script>
