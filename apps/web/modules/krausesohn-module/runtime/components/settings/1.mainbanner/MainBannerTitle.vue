<template>
    <div class="py-2 px-4">
      <div class="mb-4">
        <UiFormLabel for="main-banner-desktop-url">Title</UiFormLabel>
        <SfInput id="main-banner-desktop-url" v-model="mainBannerTitle" type="text" data-testid="main-banner-desktop-url" class="w-full" />
      </div>
    </div>
</template>
<script setup lang="ts">
import { SfInput, SfTextarea, SfIconClose } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('mainBannerTitle');

const mainBannerTitle = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
