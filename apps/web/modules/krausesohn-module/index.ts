import { defineNuxtModule, addComponent, createResolver, extendPages, addPlugin } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema'

export default defineNuxtModule({
  setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url);



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
      name: 'BannerSettingsDrawer',
      filePath: resolve('./runtime/components/BannerSettingsDrawer/BannerSettingsDrawer.vue'),
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
