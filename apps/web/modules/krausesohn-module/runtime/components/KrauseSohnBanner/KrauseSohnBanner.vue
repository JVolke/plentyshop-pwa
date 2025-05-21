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
        <div class="absolute bottom-0 left-0 w-full p-4 bg-primary-500 bg-opacity-75 text-white hover:bg-opacity-100 transition-colors duration-300">
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
          <div class="absolute bottom-0 left-0 w-full p-3 bg-primary-500 bg-opacity-75 text-white hover:bg-opacity-100 transition-colors duration-300">
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
// Definieren Sie die Banner-Schnittstelle direkt in der Komponente
interface Banner {
  desktopUrl: string;
  mobileUrl: string;
  link: string;
  title: string;
  alt: string;
}

// Runtime Konfiguration abrufen
const config = useRuntimeConfig();

// Typisieren Sie die extracted values explizit
const mainBanner: Banner = config.public.mainBanner as Banner;
const secondaryBanners: Banner[] = config.public.secondaryBanners as Banner[];
</script>
