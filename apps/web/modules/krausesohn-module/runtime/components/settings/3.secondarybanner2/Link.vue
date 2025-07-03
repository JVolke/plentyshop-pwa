<template>
  <div class="py-2 px-4">
    <div class="mb-4">
      <UiFormLabel for="main-banner-desktop-url">2. Untere Banner Link</UiFormLabel>
      <SfInput id="main-banner-desktop-url" v-model="secondaryBanner2Link" type="text" data-testid="main-banner-desktop-url" class="w-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfTextarea, SfIconClose } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('secondaryBanner2Link');

const secondaryBanner2Link = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
