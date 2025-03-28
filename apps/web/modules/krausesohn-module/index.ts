import { defineNuxtModule, addComponent, createResolver, extendPages } from '@nuxt/kit';
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
      name: 'MinimumShipping',
      filePath: resolve('./runtime/components/MinimumShipping.vue'),
    });
    addComponent({
      name: 'CategoryPageHeaderImage',
      filePath: resolve('./runtime/components/CategoryPageHeaderImage/CategoryPageHeaderImage.vue'),
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'MegaMenu');
      if (comp) {
        comp.filePath = resolve('./runtime/components/MegaMenu/MegaMenu.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'ProductSlider');
      if (comp) {
        comp.filePath = resolve('./runtime/components/ProductSlider/ProductSlider.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'Header');
      if (comp) {
        comp.filePath = resolve('./runtime/components/Header.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'OrderSummary');
      if (comp) {
        comp.filePath = resolve('./runtime/components/OrderSummary/OrderSummary.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      const comp = components.find((c) => c.pascalName === 'UiCartProductCard');
      if (comp) {
        comp.filePath = resolve('./runtime/components/CardProductCard/CardProductCard.vue');
      }
    });

    /** Override ProductPages */
    extendPages((pages: NuxtPage[]) => {
      const overridePage = pages.find((p) => p.name === 'product-slug');
      if (overridePage) {
        overridePage.file = resolve('./runtime/pages/product/[slug].vue');
      }
    });

  },
});
