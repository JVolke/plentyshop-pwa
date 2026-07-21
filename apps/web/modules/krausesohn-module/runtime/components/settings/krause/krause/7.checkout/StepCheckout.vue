<template>
  <div class="py-2 flex flex-col">
    <span class="mb-2">
      {{ getEditorTranslation('description') }}
    </span>
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfSwitch
        v-model="enabled"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('enableKrauseStepCheckout');

const enabled = computed({
  get: () => String(getSetting()) !== 'false',
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Use step-by-step checkout",
    "description": "Switches the checkout between the step-by-step layout and the original single-page checkout."
  },
  "de": {
    "label": "Step-by-Step Checkout nutzen",
    "description": "Schaltet den Checkout zwischen Schrittansicht und urspruenglichem Single-Page Checkout um."
  }
}
</i18n>
