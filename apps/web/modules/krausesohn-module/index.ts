import { defineNuxtModule, addComponent, createResolver, extendPages, addPlugin, updateRuntimeConfig } from '@nuxt/kit';
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
    addComponent({
      name: 'ShippingTimer',
      filePath: resolve('./runtime/components/ShippingTimer.vue'),
    });
    addComponent({
      name: 'CategoryPageHeaderImage',
      filePath: resolve('./runtime/components/CategoryPageHeaderImage/CategoryPageHeaderImage.vue'),
    });
    addComponent({
      name: 'CategoryDescription',
      filePath: resolve('./runtime/components/CategoryDescription/CategoryDescription.vue'),
    });

    addComponent({
      name: 'ShopAuskunft',
      filePath: resolve('./runtime/components/ShopAuskunft/ShopAuskunft.vue'),
    });
    addComponent({
      name: 'ShopAuskunftRBA',
      filePath: resolve('./runtime/components/ShopAuskunft/ShopAuskunftRBA.vue'),
    });
    addComponent({
      name: 'KrauseSohnBanner',
      filePath: resolve('./runtime/components/KrauseSohnBanner/KrauseSohnBanner.vue'),
    });
    addComponent({
      name: 'KrauseSohnNotifyMessage',
      filePath: resolve('./runtime/components/KrauseSohnNotifyMessage/KrauseSohnNotifyMessage.vue'),
    });
    addComponent({
      name: 'FeuerwerkLink',
      filePath: resolve('./runtime/components/FeuerwerkLink/FeuerwerkLink.vue'),
    });

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

    //addPlugin(resolve('./runtime/plugins/shopauskunft.client'));
  },
});
