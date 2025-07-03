<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel for="matomo-site-id-input">Matomo Site ID</UiFormLabel>
      <SfTooltip
        label="The numeric ID for your website in Matomo (e.g., 1)."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput
        id="matomo-site-id-input"
        v-model="matomoId"
        type="text"
        placeholder="1"
        data-testid="matomo-site-id-input"
        class="w-full"
      />
      <span class="typography-text-xs text-neutral-700">Enter the Site ID from your Matomo setup</span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('matomoId');


const matomoId = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});


</script>
