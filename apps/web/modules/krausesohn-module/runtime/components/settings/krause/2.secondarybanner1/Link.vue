<template>
  <div class="py-2 px-4">
    <div class="mb-4">
      <UiFormLabel for="main-banner-desktop-url">1. Untere Banner Link</UiFormLabel>
      <SfInput id="main-banner-desktop-url" v-model="secondaryBanner1Link" type="text" data-testid="main-banner-desktop-url" class="w-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfTextarea, SfIconClose } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('secondaryBanner1Link');

const secondaryBanner1Link = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
