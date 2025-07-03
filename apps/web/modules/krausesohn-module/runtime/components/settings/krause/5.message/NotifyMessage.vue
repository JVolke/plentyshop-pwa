<template>
  <div class="py-2 px-4">
    <div class="mb-4">
      <UiFormLabel for="notify-message">Text</UiFormLabel>
      <SfTextarea  id="notify-message" v-model="notifyMessage"  class="w-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfTextarea } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('notifyMessage');

const notifyMessage = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);}
});
</script>
