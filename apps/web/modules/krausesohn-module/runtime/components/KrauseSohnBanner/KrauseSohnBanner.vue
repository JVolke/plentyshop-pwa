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
import { useSiteConfiguration } from '~/composables';

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

const { getSetting: getMainBannerDesktopUrl } = useSiteSettings('mainBannerDesktopUrl');
const mainBannerDesktopUrl = computed(() => getMainBannerDesktopUrl() );
const { getSetting: getMainBannerMobileUrl } = useSiteSettings('mainBannerMobileUrl');
const mainBannerMobileUrl = computed(() => getMainBannerMobileUrl() );
const { getSetting: getMainBannerLink } = useSiteSettings('mainBannerLink');
const mainBannerLink = computed(() => getMainBannerLink() );
const { getSetting: getMainBannerTitle } = useSiteSettings('mainBannerTitle');
const mainBannerTitle = computed(() => getMainBannerTitle() );
const { getSetting: getMainBannerAlt } = useSiteSettings('mainBannerAlt');
const mainBannerAlt = computed(() => getMainBannerAlt() );

const { getSetting: getSecondaryBanner1DesktopUrl } = useSiteSettings('secondaryBanner1DesktopUrl');
const secondaryBanner1DesktopUrl = computed(() => getSecondaryBanner1DesktopUrl() );
const { getSetting: getSecondaryBanner1Link } = useSiteSettings('secondaryBanner1Link');
const secondaryBanner1Link = computed(() => getSecondaryBanner1Link() );
const { getSetting: getSecondaryBanner1Title } = useSiteSettings('secondaryBanner1Title');
const secondaryBanner1Title = computed(() => getSecondaryBanner1Title() );
const { getSetting: getSecondaryBanner1Alt } = useSiteSettings('secondaryBanner1Alt');
const secondaryBanner1Alt = computed(() => getSecondaryBanner1Alt() );
const { getSetting: getSecondaryBanner2DesktopUrl } = useSiteSettings('secondaryBanner2DesktopUrl');
const secondaryBanner2DesktopUrl = computed(() => getSecondaryBanner2DesktopUrl() );
const { getSetting: getSecondaryBanner2Link } = useSiteSettings('secondaryBanner2Link');
const secondaryBanner2Link = computed(() => getSecondaryBanner2Link() );
const { getSetting: getSecondaryBanner2Title } = useSiteSettings('secondaryBanner2Title');
const secondaryBanner2Title = computed(() => getSecondaryBanner2Title() );
const { getSetting: getSecondaryBanner2Alt } = useSiteSettings('secondaryBanner2Alt');
const secondaryBanner2Alt = computed(() => getSecondaryBanner2Alt() );
const { getSetting: getSecondaryBanner3DesktopUrl } = useSiteSettings('secondaryBanner3DesktopUrl');
const secondaryBanner3DesktopUrl = computed(() => getSecondaryBanner3DesktopUrl() );
const { getSetting: getSecondaryBanner3Link } = useSiteSettings('secondaryBanner3Link');
const secondaryBanner3Link = computed(() => getSecondaryBanner3Link() );
const { getSetting: getSecondaryBanner3Title } = useSiteSettings('secondaryBanner3Title');
const secondaryBanner3Title = computed(() => getSecondaryBanner3Title() );
const { getSetting: getSecondaryBanner3Alt } = useSiteSettings('secondaryBanner3Alt');
const secondaryBanner3Alt = computed(() => getSecondaryBanner3Alt() );

// --- Hauptbanner-Logik ---
const mainBanner = computed<Banner>(() => ({
  desktopUrl: mainBannerDesktopUrl.value,
  mobileUrl: mainBannerMobileUrl.value,
  link: mainBannerLink.value,
  title: mainBannerTitle.value,
  alt: mainBannerAlt.value,
}));

// --- Sekundärbanner-Logik ---
// Da die Banner flach sind, müssen wir sie manuell in ein Array von Banner-Objekten umwandeln.
const secondaryBanners = computed<Banner[]>(() => {
  const banners: Banner[] = [];
  // Banner 1
  if (secondaryBanner1DesktopUrl.value) {
    banners.push({
      desktopUrl: secondaryBanner1DesktopUrl.value,
      link: secondaryBanner1Link.value,
      title: secondaryBanner1Title.value,
      alt: secondaryBanner1Alt.value,
    });
  }
  // Banner 2
  if (secondaryBanner2DesktopUrl.value) {
    banners.push({
      desktopUrl: secondaryBanner2DesktopUrl.value,
      link: secondaryBanner2Link.value,
      title: secondaryBanner2Title.value,
      alt: secondaryBanner2Alt.value,
    });
  }
  // Banner 3
  if (secondaryBanner3DesktopUrl.value) {
    banners.push({
      desktopUrl: secondaryBanner3DesktopUrl.value,
      link: secondaryBanner3Link.value,
      title: secondaryBanner3Title.value,
      alt: secondaryBanner3Alt.value,
    });
  }
  return banners;
});
</script>
