import { defineNuxtModule, addComponentsDir, createResolver, extendPages, addPlugin, updateRuntimeConfig } from 'nuxt/kit';
import type { NuxtPage } from '@nuxt/schema'

export default defineNuxtModule({
  setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url);
   updateRuntimeConfig({
     public: {
      mainBannerDesktopUrl: process.env.NUXT_PUBLIC_MAIN_BANNER_DESKTOP_URL || '',
      mainBannerMobileUrl: process.env.NUXT_PUBLIC_MAIN_BANNER_MOBILE_URL || '',
      mainBannerLink: process.env.NUXT_PUBLIC_MAIN_BANNER_LINK || '',
      mainBannerTitle: process.env.NUXT_PUBLIC_MAIN_BANNER_TITLE ||'',
      mainBannerAlt: process.env.NUXT_PUBLIC_MAIN_BANNER_ALT || '',
      secondaryBanner1DesktopUrl: process.env.NUXT_PUBLIC_SECONDARY_BANNER1_DESKTOP_URL || '',
      secondaryBanner2DesktopUrl: process.env.NUXT_PUBLIC_SECONDARY_BANNER2_DESKTOP_URL  || '',
      secondaryBanner3DesktopUrl: process.env.NUXT_PUBLIC_SECONDARY_BANNER3_DESKTOP_URL || '',
      secondaryBanner1Link: process.env.NUXT_PUBLIC_SECONDARY_BANNER1_LINK || '',
      secondaryBanner2Link: process.env.NUXT_PUBLIC_SECONDARY_BANNER2_LINK ||'',
      secondaryBanner3Link: process.env.NUXT_PUBLIC_SECONDARY_BANNER3_LINK ||'',
      secondaryBanner1Title: process.env.NUXT_PUBLIC_SECONDARY_BANNER1_TITLE || '',
      secondaryBanner2Title: process.env.NUXT_PUBLIC_SECONDARY_BANNER2_TITLE || '',
      secondaryBanner3Title: process.env.NUXT_PUBLIC_SECONDARY_BANNER3_TITLE || '',
      secondaryBanner1Alt: process.env.NUXT_PUBLIC_SECONDARY_BANNER1_ALT || '',
      secondaryBanner2Alt: process.env.NUXT_PUBLIC_SECONDARY_BANNER2_ALT || '',
      secondaryBanner3Alt: process.env.NUXT_PUBLIC_SECONDARY_BANNER3_ALT || '',
      notifyMessage: process.env.NUXT_PUBLIC_NOTIFY_MESSAGE || '',
     }
    });


    // Komponente hinzufügen
    // Alle Komponenten unter runtime/components werden global nutzbar (<ShopAuskunft /> etc.)
    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false, // Name = Dateiname, ohne Verzeichnispräfix
      global: true       // überall nutzbar ohne Import
    })

    nuxt.hook('components:extend', (components) => {
      const uiButton = components.find((c) => c.pascalName === 'AddressFormShipping');
      if (uiButton) {
        uiButton.filePath = resolve('./runtime/components/AddressFormShipping/AddressFormShipping.vue');
      }
    });

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolve('./runtime/lang'),
        locales: [
          {
            code: 'de',
            file: 'de.json',
          },
        ],
      })
    })

  },
});
