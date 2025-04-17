<template>
  <div class="site-settings-view sticky top-[52px]" >
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Matomo</div>
      <button class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <UiAccordionItem
      v-model="matomoOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="typography-headline-3">Matomo Analytics</h2>
      </template>
      <div class="py-2 space-y-4">
        <div class="flex justify-between mb-2">
          <UiFormLabel for="matomo-url">Matomo URL</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="matomoUrl" type="text" />
          <span class="typography-text-xs text-neutral-700">Insert Matomo URL</span>
        </label>
      </div>
      <div class="py-2 space-y-4">
        <div class="flex justify-between mb-2">
          <UiFormLabel for="matomo-url">Matomo Id</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="matomoId" type="number" />
          <span class="typography-text-xs text-neutral-700">Insert Matomo URL</span>
        </label>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfInput } from '@storefront-ui/vue';

import { useSiteConfiguration } from '~/composables/useSiteConfiguration';

const { closeDrawer,
  matomoUrl, matomoId
} = useSiteConfiguration();

const matomoOpen = ref(false);
</script>
