<template>
  <div class="py-2 px-4">
    <div class="mb-4">
      <UiFormLabel for="cut-off">Bestellzeit (ganze Zahl) bei 0 deaktiviert</UiFormLabel>
      <SfInput id="cut-off" v-model="cutOff" type="number" data-testid="main-banner-desktop-url" class="w-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('cutOff');

const cutOff = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
