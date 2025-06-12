<template>
  <div
    class="matomo-settings-drawer fixed top-0 right-0 w-[320px] h-full bg-white shadow-lg flex flex-col transform translate-x-full transition-transform duration-300 z-[1000]"
    :class="{ 'translate-x-0': modelValue }"
    data-testid="matomo-settings-drawer"
  >
    <div
      class="matomo-settings-drawer__overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 z-[999]"
      :class="{ 'opacity-100': modelValue }"
      @click="close"
    />

    <div class="site-settings-view sticky top-[52px] flex flex-col h-full overflow-y-auto"
         data-testid="matomo-settings-drawer-content">
      <header class="flex items-center justify-between px-4 py-5 border-b">
        <div class="flex items-center text-xl font-bold">Matomo Settings</div>
        <button data-testid="matomo-view-close" class="!p-0" @click="close">
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

    <footer class="flex justify-end p-4 border-t sticky bottom-0 bg-white z-[1001]">
      <button class="mr-2 py-2 px-4 rounded-md border" @click="close">
        Abbrechen
      </button>
      <button
        class="py-2 px-4 rounded-md text-white"
        :class="{
          'bg-blue-600 hover:bg-blue-700': settingsIsDirty,
          'bg-gray-300 cursor-not-allowed': !settingsIsDirty,
        }"
        :disabled="!settingsIsDirty || loading"
        @click="save"
      >
        {{ loading ? 'Speichere...' : 'Speichern' }}
      </button>
    </footer>
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
  saveSettings,
  settingsIsDirty,
  loading
} = useSiteConfiguration();

// Reactive variable for the Matomo accordion item state
const matomoOpen = ref(true); // Open by default for a dedicated Matomo drawer

// --- Drawer control logic ---
const close = () => {
  emit('update:modelValue', false);
};

const save = async () => {
  if (settingsIsDirty.value && !loading.value) {
    await saveSettings();
    close(); // Close drawer after successful save
  }
};

// Handle clicks outside the drawer to close it
const handleOutsideClick = (event: MouseEvent) => {
  const drawerElement = document.querySelector('[data-testid="matomo-settings-drawer"]');
  const clickedElement = event.target as HTMLElement;

  // Check if drawer is open and click was outside the drawer content itself
  if (props.modelValue && drawerElement && !drawerElement.contains(clickedElement)) {
    close();
  }
};

// Add/remove event listener for outside clicks
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleOutsideClick);
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
}, { immediate: true }); // Immediate ensures it's set up on mount if drawer is initially open

// Ensure the listener is cleaned up on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

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
