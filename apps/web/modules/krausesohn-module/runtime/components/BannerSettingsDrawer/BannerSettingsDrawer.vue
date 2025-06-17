<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="banner-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Banner Einstellungen</div>
      <button data-testid="banner-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <UiAccordionItem
      v-model="mainBannerOpen"
      data-testid="main-banner-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Hauptbanner</h2>
      </template>
      <div class="py-2 px-4">
        <div class="mb-4">
          <UiFormLabel for="main-banner-desktop-url">Desktop URL</UiFormLabel>
          <SfInput id="main-banner-desktop-url" v-model="mainBannerDesktopUrl" type="text" data-testid="main-banner-desktop-url" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-mobile-url">Mobile URL</UiFormLabel>
          <SfInput id="main-banner-mobile-url" v-model="mainBannerMobileUrl" type="text" data-testid="main-banner-mobile-url" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-link">Link</UiFormLabel>
          <SfInput id="main-banner-link" v-model="mainBannerLink" type="text" data-testid="main-banner-link" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-title">Titel</UiFormLabel>
          <SfInput id="main-banner-title" v-model="mainBannerTitle" type="text" data-testid="main-banner-title" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-alt">Alt-Text</UiFormLabel>
          <SfInput id="main-banner-alt" v-model="mainBannerAlt" type="text" data-testid="main-banner-alt" class="w-full" />
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="secondaryBannersSectionOpen"
      data-testid="secondary-banners-main-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Sekundärbanner</h2>
      </template>
      <div class="py-2 px-4">
        <UiAccordionItem
          v-model="secondaryBanner1Open"
          data-testid="secondary-banner-0-section"
          summary-active-class="bg-neutral-100"
          summary-class="w-full hover:bg-neutral-100 px-4 py-2 flex justify-between items-center select-none border-b last:border-b-0"
        >
          <template #summary>
            <h3 class="font-bold">Banner 1</h3>
          </template>
          <div class="py-2 px-4">
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-0-desktop-url">Desktop URL</UiFormLabel>
              <SfInput id="secondary-banner-0-desktop-url" v-model="secondaryBanner1DesktopUrl" type="text" data-testid="secondary-banner-0-desktop-url" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-0-link">Link</UiFormLabel>
              <SfInput id="secondary-banner-0-link" v-model="secondaryBanner1Link" type="text" data-testid="secondary-banner-0-link" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-0-title">Titel</UiFormLabel>
              <SfInput id="secondary-banner-0-title" v-model="secondaryBanner1Title" type="text" data-testid="secondary-banner-0-title" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-0-alt">Alt-Text</UiFormLabel>
              <SfInput id="secondary-banner-0-alt" v-model="secondaryBanner1Alt" type="text" data-testid="secondary-banner-0-alt" class="w-full" />
            </div>
          </div>
        </UiAccordionItem>

        <UiAccordionItem
          v-model="secondaryBanner2Open"
          data-testid="secondary-banner-1-section"
          summary-active-class="bg-neutral-100"
          summary-class="w-full hover:bg-neutral-100 px-4 py-2 flex justify-between items-center select-none border-b last:border-b-0"
        >
          <template #summary>
            <h3 class="font-bold">Banner 2</h3>
          </template>
          <div class="py-2 px-4">
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-1-desktop-url">Desktop URL</UiFormLabel>
              <SfInput id="secondary-banner-1-desktop-url" v-model="secondaryBanner2DesktopUrl" type="text" data-testid="secondary-banner-1-desktop-url" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-1-link">Link</UiFormLabel>
              <SfInput id="secondary-banner-1-link" v-model="secondaryBanner2Link" type="text" data-testid="secondary-banner-1-link" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-1-title">Titel</UiFormLabel>
              <SfInput id="secondary-banner-1-title" v-model="secondaryBanner2Title" type="text" data-testid="secondary-banner-1-title" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-1-alt">Alt-Text</UiFormLabel>
              <SfInput id="secondary-banner-1-alt" v-model="secondaryBanner2Alt" type="text" data-testid="secondary-banner-1-alt" class="w-full" />
            </div>
          </div>
        </UiAccordionItem>

        <UiAccordionItem
          v-model="secondaryBanner3Open"
          data-testid="secondary-banner-2-section"
          summary-active-class="bg-neutral-100"
          summary-class="w-full hover:bg-neutral-100 px-4 py-2 flex justify-between items-center select-none border-b last:border-b-0"
        >
          <template #summary>
            <h3 class="font-bold">Banner 3</h3>
          </template>
          <div class="py-2 px-4">
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-2-desktop-url">Desktop URL</UiFormLabel>
              <SfInput id="secondary-banner-2-desktop-url" v-model="secondaryBanner3DesktopUrl" type="text" data-testid="secondary-banner-2-desktop-url" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-2-link">Link</UiFormLabel>
              <SfInput id="secondary-banner-2-link" v-model="secondaryBanner3Link" type="text" data-testid="secondary-banner-2-link" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-2-title">Titel</UiFormLabel>
              <SfInput id="secondary-banner-2-title" v-model="secondaryBanner3Title" type="text" data-testid="secondary-banner-2-title" class="w-full" />
            </div>
            <div class="mb-4">
              <UiFormLabel for="secondary-banner-2-alt">Alt-Text</UiFormLabel>
              <SfInput id="secondary-banner-2-alt" v-model="secondaryBanner3Alt" type="text" data-testid="secondary-banner-2-alt" class="w-full" />
            </div>
          </div>
        </UiAccordionItem>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SfIconClose, SfInput } from '@storefront-ui/vue';
import { useSiteConfiguration } from '~/composables/useSiteConfiguration/useSiteConfiguration';

const {
  mainBannerDesktopUrl,
  mainBannerMobileUrl,
  mainBannerLink,
  mainBannerTitle,
  mainBannerAlt,
  secondaryBanner1DesktopUrl,
  secondaryBanner1Link,
  secondaryBanner1Title,
  secondaryBanner1Alt,
  secondaryBanner2DesktopUrl,
  secondaryBanner2Link,
  secondaryBanner2Title,
  secondaryBanner2Alt,
  secondaryBanner3DesktopUrl,
  secondaryBanner3Link,
  secondaryBanner3Title,
  secondaryBanner3Alt,
  closeDrawer,
} = useSiteConfiguration();

const mainBannerOpen = ref(true); // Standardmäßig geöffnet

// Neues Ref für den übergeordneten Accordion-Abschnitt der Sekundärbanner
const secondaryBannersSectionOpen = ref(false); // Anfangs geschlossen

// Ein Array von Refs für den Zustand jedes einzelnen Sekundärbanners
// Initialisiere alle als geschlossen, oder je nach Bedarf.
const secondaryBanner1Open = ref(false);
const secondaryBanner2Open = ref(false);
const secondaryBanner3Open = ref(false);

// Optional: Wenn Sie möchten, dass das erste Sekundärbanner standardmäßig geöffnet ist:
// if (secondaryBannersOpen.value.length > 0) {
//   secondaryBannersOpen.value[0] = true;
// }
</script>
