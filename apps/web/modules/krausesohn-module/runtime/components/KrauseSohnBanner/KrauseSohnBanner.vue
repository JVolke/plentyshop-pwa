<template>
  <div class="mx-auto max-w-screen-3xl mt-2 px-4 md:px-6 lg:px-10">
    <div class="relative mb-3 overflow-hidden rounded-lg shadow-md">
      <a :href="mainBanner.link" class="block w-full h-full relative">
        <img
          :src="mainBanner.desktopUrl"
          :srcset="`${mainBanner.mobileUrl} 400w, ${mainBanner.desktopUrl} 768w, ${mainBanner.desktopUrl} 992w`"
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 100vw, 976px"
          width="1458"
          height="480"
          class="w-full h-auto object-cover rounded-lg"
          style="max-height: 480px"
          :alt="mainBanner.alt"
        />
        <div class="absolute bottom-0 left-0 w-full p-2 bg-primary-500 bg-opacity-85 bg-opa text-white hover:bg-opacity-100 transition-colors duration-300">
          <h2 class="text-xl md:text-2xl font-bold">
            {{ mainBanner.title }}
          </h2>
        </div>
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
      <div
        v-for="(banner, index) in secondaryBanners"
        :key="index"
        class="relative overflow-hidden rounded-lg shadow-md"
      >
        <a :href="banner.link" class="block w-full h-full relative">
          <img
            :src="banner.desktopUrl"
            width="383"
            height="229"
            class="w-full h-auto object-cover rounded-lg"
            :alt="banner.alt"
          />
          <div class="absolute bottom-0 left-0 w-full p-2 bg-primary-500 bg-opacity-85 text-white hover:bg-opacity-100 transition-colors duration-300">
            <h2 class="text-base md:text-lg font-bold">
              {{ banner.title }}
            </h2>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Definieren Sie die Banner-Schnittstelle direkt in der Komponente
interface Banner {
  desktopUrl: string;
  mobileUrl?: string; // Mobile URL ist bei Sekundärbannern optional oder nicht vorhanden
  link: string;
  title: string;
  alt: string;
}

// Runtime Konfiguration abrufen
const config = useRuntimeConfig();

// --- Hauptbanner-Logik ---
const mainBanner = computed<Banner>(() => ({
  desktopUrl: config.public.mainBannerDesktopUrl as string,
  mobileUrl: config.public.mainBannerMobileUrl as string,
  link: config.public.mainBannerLink as string,
  title: config.public.mainBannerTitle as string,
  alt: config.public.mainBannerAlt as string,
}));

// --- Sekundärbanner-Logik ---
// Da die Banner flach sind, müssen wir sie manuell in ein Array von Banner-Objekten umwandeln.
const secondaryBanners = computed<Banner[]>(() => {
  const banners: Banner[] = [];
  // Banner 1
  if (config.public.secondaryBanner1DesktopUrl) {
    banners.push({
      desktopUrl: config.public.secondaryBanner1DesktopUrl as string,
      link: config.public.secondaryBanner1Link as string,
      title: config.public.secondaryBanner1Title as string,
      alt: config.public.secondaryBanner1Alt as string,
    });
  }
  // Banner 2
  if (config.public.secondaryBanner2DesktopUrl) {
    banners.push({
      desktopUrl: config.public.secondaryBanner2DesktopUrl as string,
      link: config.public.secondaryBanner2Link as string,
      title: config.public.secondaryBanner2Title as string,
      alt: config.public.secondaryBanner2Alt as string,
    });
  }
  // Banner 3
  if (config.public.secondaryBanner3DesktopUrl) {
    banners.push({
      desktopUrl: config.public.secondaryBanner3DesktopUrl as string,
      link: config.public.secondaryBanner3Link as string,
      title: config.public.secondaryBanner3Title as string,
      alt: config.public.secondaryBanner3Alt as string,
    });
  }
  return banners;
});
</script>
