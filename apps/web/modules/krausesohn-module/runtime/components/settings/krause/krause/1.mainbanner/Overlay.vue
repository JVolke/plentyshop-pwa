<template>
    <div class="py-2 px-4">
      <div class="flex justify-between mb-2">
        <UiFormLabel for="banner-label-overlay">Overlay</UiFormLabel>
        <SfSwitch
          v-model="bannerLabelOverlay"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        />
      </div>
    </div>
</template>
<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('bannerLabelOverlay');

const bannerLabelOverlay = computed({
  get: () => !!getSetting(),
  set: (value) => updateSetting(value.toString()),
});
</script>
