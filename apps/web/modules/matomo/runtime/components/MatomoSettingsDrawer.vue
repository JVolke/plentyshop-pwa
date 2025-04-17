<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Settings</div>
      <button data-testid="design-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <UiAccordionItem
      v-model="matomoOpen"
      data-testid="matomo-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Matomo Analytics</h2>
      </template>
      <div class="py-2 space-y-4">
        <div class="flex justify-between mb-2">
          <UiFormLabel for="matomo-url">Matomo URL</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="matomo.url" type="text" />
          <span class="typography-text-xs text-neutral-700">Insert Matomo URL</span>
        </label>
      </div>
      <div class="py-2 space-y-4">
        <div class="flex justify-between mb-2">
          <UiFormLabel for="matomo-url">Matomo Id</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="matomo.id" type="number" />
          <span class="typography-text-xs text-neutral-700">Insert Matomo URL</span>
        </label>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfInput } from '@storefront-ui/vue';

import { useSiteConfiguration } from '~/composables/useSiteConfiguration';

const { closeDrawer,  matomo } = useSiteConfiguration();

const matomoOpen = ref(false);
</script>
