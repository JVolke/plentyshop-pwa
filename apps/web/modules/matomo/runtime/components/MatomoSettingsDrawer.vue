<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Matomo Einstellungen</div>
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
          <h2 class="">Matomo Tracking</h2>
        </template>
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
      </UiAccordionItem>
  </div>

</template>

<script setup lang="ts">
import { SfIconClose, SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import { useSiteConfiguration } from '~/composables/useSiteConfiguration/useSiteConfiguration';

const {
  matomoUrl,
  matomoId,
  closeDrawer,
} = useSiteConfiguration();

const matomoOpen = ref(true); // Open by default for a dedicated Matomo drawer
</script>
