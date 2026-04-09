<template>
  <div class="py-2 px-4">
    <div class="mb-4">
      <UiFormLabel for="delivery-time">Zeit in Tagen</UiFormLabel>
      <SfInput id="delivery-time" v-model="deliveryTime" type="number" data-testid="main-banner-desktop-url" class="w-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('deliveryTime');

const deliveryTime = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
