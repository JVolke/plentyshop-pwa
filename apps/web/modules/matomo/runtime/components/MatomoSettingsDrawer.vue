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
              v-model="matomoSiteId"
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
import { ref, watch } from 'vue';
import { SfIconClose, SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import { useSiteConfiguration } from '~/composables/useSiteConfiguration/useSiteConfiguration';

// Props for controlling drawer visibility
const props = defineProps<{
  modelValue: boolean;
}>();

// Emits for updating modelValue (v-model)
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// Destructure only Matomo-related properties and functions from useSiteConfiguration
const {
  matomoUrl,
  matomoSiteId,
  closeDrawer,
} = useSiteConfiguration();

// Reactive variable for the Matomo accordion item state
const matomoOpen = ref(true); // Open by default for a dedicated Matomo drawer

</script>

<style scoped>
/* Base styles for the drawer container */
.matomo-settings-drawer {
  /* This container acts as the drawer itself, controlling its position and transform */
  background-color: white; /* Ensure background is white */
}

/* Overlay for the background when the drawer is open */
.matomo-settings-drawer__overlay {
  /* This overlay covers the main content */
  pointer-events: none; /* By default, no pointer events */
}

.matomo-settings-drawer__overlay.opacity-100 {
  pointer-events: auto; /* Enable pointer events when visible */
}

/* Adapt the .site-settings-view class to fit within this new drawer component */
.site-settings-view {
  /* Ensure this section fills available space and allows scrolling */
  flex-grow: 1; /* Allows it to take up available vertical space */
  overflow-y: auto; /* Enables vertical scrolling for content */
  height: calc(100vh - 52px); /* Adjust based on header height, if it's fixed */
  /* Remove sticky top-[52px] if the header is part of this component's scrollable content */
  top: 0; /* Override sticky position if it's a sub-component now */
}

/* Styles for the footer to make it sticky at the bottom of the drawer */
footer {
  box-shadow: 0 -2px 5px rgba(0,0,0,0.05); /* Optional subtle shadow */
}
</style>
<script setup lang="ts">
</script>
<script setup lang="ts">
</script>
