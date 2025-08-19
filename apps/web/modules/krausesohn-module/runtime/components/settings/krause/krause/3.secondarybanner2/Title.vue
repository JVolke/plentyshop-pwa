<template>
  <div class="py-2 px-4">
    <div class="mb-4">
      <UiFormLabel for="main-banner-desktop-url">2. Untere Banner Title</UiFormLabel>
      <SfInput id="main-banner-desktop-url" v-model="secondaryBanner2Title" type="text" data-testid="main-banner-desktop-url" class="w-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfTextarea, SfIconClose } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('secondaryBanner2Title');

const secondaryBanner2Title = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
