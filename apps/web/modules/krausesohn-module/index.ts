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

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'MegaMenu');
      if (comp) {
        comp.filePath = resolve('./runtime/components/MegaMenu/MegaMenu.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'CategoryPageContent');
      if (comp) {
        comp.filePath = resolve('./runtime/components/CategoryPageContent/CategoryPageContent.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'CustomerWish');
      if (comp) {
        comp.filePath = resolve('./runtime/components/CustomerWish/CustomerWish.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'ShippingMethod');
      if (comp) {
        comp.filePath = resolve('./runtime/components/ShippingMethod/ShippingMethod.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'VariationProperties');
      if (comp) {
        comp.filePath = resolve('./runtime/components/VariationProperties/VariationProperties.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'ProductAccordion');
      if (comp) {
        comp.filePath = resolve('./runtime/components/ProductAccordion/ProductAccordion.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'UiPurchaseCard');
      if (comp) {
        comp.filePath = resolve('./runtime/components/PurchaseCard/PurchaseCard.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'UiCartProductCard');
      if (comp) {
        comp.filePath = resolve('./runtime/components/CardProductCard/CardProductCard.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'ConfirmationPageContent');
      if (comp) {
        comp.filePath = resolve('./runtime/components/ConfirmationPageContent/ConfirmationPageContent.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'CheckoutGeneralTerms');
      if (comp) {
        comp.filePath = resolve('./runtime/components/CheckoutGeneralTerms/CheckoutGeneralTerms.vue');
      }
    });

    /** Override ProductPages */
    extendPages((pages: NuxtPage[]) => {
      const overridePage = pages.find((p) => p.name === 'product-slug');
      if (overridePage) {
        overridePage.file = resolve('./runtime/pages/product/[slug].vue');
      }
    });

    /** Override CategoryPage */
    extendPages((pages: NuxtPage[]) => {
      const overridePage = pages.find((p) => p.name === 'slug');
      if (overridePage) {
        overridePage.file = resolve('./runtime/pages/[...slug].vue');
      }
    });

    /** Override Guest Login */
    extendPages((pages: NuxtPage[]) => {
      const overridePage = pages.find((p) => p.name === 'guest-login');
      if (overridePage) {
        overridePage.file = resolve('./runtime/pages/guest/login.vue');
      }
    });

    /**
     * Override Checkout
     * */
    extendPages((pages: NuxtPage[]) => {
      const overridePage = pages.find((p) => p.name === 'checkout');
      if (overridePage) {
        overridePage.file = resolve('./runtime/pages/checkout.vue');
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
