<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel for="matomo-url-input">Matomo URL</UiFormLabel>
      <SfTooltip
        label="The base URL of your Matomo instance (e.g., https://your-matomo-domain.com/). Do not include 'matomo.php' or 'piwik.php'."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput
        id="matomo-url-input"
        v-model="matomoUrl"
        type="text"
        placeholder="https://your.matomo.domain.com"
        data-testid="matomo-url-input"
        class="w-full"
      />
      <span class="typography-text-xs text-neutral-700"
      >Enter the URL of your Matomo instance (without /matomo.php)</span
      >
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('matomoUrl');

const matomoUrl = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});



</script>
