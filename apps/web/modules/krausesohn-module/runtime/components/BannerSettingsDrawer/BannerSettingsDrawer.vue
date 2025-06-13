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
          <SfInput id="main-banner-desktop-url" v-model="mainBanner.desktopUrl" type="text" data-testid="main-banner-desktop-url" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-mobile-url">Mobile URL</UiFormLabel>
          <SfInput id="main-banner-mobile-url" v-model="mainBanner.mobileUrl" type="text" data-testid="main-banner-mobile-url" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-link">Link</UiFormLabel>
          <SfInput id="main-banner-link" v-model="mainBanner.link" type="text" data-testid="main-banner-link" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-title">Titel</UiFormLabel>
          <SfInput id="main-banner-title" v-model="mainBanner.title" type="text" data-testid="main-banner-title" class="w-full" />
        </div>
        <div class="mb-4">
          <UiFormLabel for="main-banner-alt">Alt-Text</UiFormLabel>
          <SfInput id="main-banner-alt" v-model="mainBanner.alt" type="text" data-testid="main-banner-alt" class="w-full" />
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="secondaryBannersOpen"
      data-testid="secondary-banners-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Sekundärbanner</h2>
      </template>
      <div class="py-2 px-4">
        <div v-for="(banner, index) in secondaryBanners" :key="index" class="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
          <h3 class="font-bold text-lg mb-2">Banner {{ index + 1 }}</h3>
          <div class="mb-4">
            <UiFormLabel :for="`secondary-banner-${index}-desktop-url`">Desktop URL</UiFormLabel>
            <SfInput :id="`secondary-banner-${index}-desktop-url`" v-model="banner.desktopUrl" type="text" :data-testid="`secondary-banner-${index}-desktop-url`" class="w-full" />
          </div>
          <div class="mb-4">
            <UiFormLabel :for="`secondary-banner-${index}-link`">Link</UiFormLabel>
            <SfInput :id="`secondary-banner-${index}-link`" v-model="banner.link" type="text" :data-testid="`secondary-banner-${index}-link`" class="w-full" />
          </div>
          <div class="mb-4">
            <UiFormLabel :for="`secondary-banner-${index}-title`">Titel</UiFormLabel>
            <SfInput :id="`secondary-banner-${index}-title`" v-model="banner.title" type="text" :data-testid="`secondary-banner-${index}-title`" class="w-full" />
          </div>
          <div class="mb-4">
            <UiFormLabel :for="`secondary-banner-${index}-alt`">Alt-Text</UiFormLabel>
            <SfInput :id="`secondary-banner-${index}-alt`" v-model="banner.alt" type="text" :data-testid="`secondary-banner-${index}-alt`" class="w-full" />
          </div>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SfIconClose, SfInput } from '@storefront-ui/vue';
import { useSiteConfiguration } from '~/composables/useSiteConfiguration/useSiteConfiguration';

const {
  mainBanner,
  secondaryBanners,
  closeDrawer, // Beibehalten, da der Matomo-Drawer dies auch verwendet
} = useSiteConfiguration();

const mainBannerOpen = ref(true); // Standardmäßig geöffnet
const secondaryBannersOpen = ref(false); // Standardmäßig geschlossen
</script>
