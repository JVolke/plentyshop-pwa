import { defineNuxtModule, createResolver, addComponent } from 'nuxt/kit'
export interface ModuleOptions {
  test: string
}
export default defineNuxtModule({
  meta: {
    name: "krausesohn",
    configKey: 'pwa_krausesohn',
    compatibility: {
      nuxt: '>=3.7',
    }
  },
  defaults: {
    test: ""
  },

  async setup(options: ModuleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'ShippingTimer',
      filePath: resolve('./runtime/components/ShippingTimer/ShippingTimer.vue'),
    });
    addComponent({
      name: 'CategoryPageHeaderImage',
      filePath: resolve('./runtime/components/CategoryPageHeaderImage/CategoryPageHeaderImage.vue'),
    });

    nuxt.hook('components:extend', (components) => {
      const uiButton = components.find((c) => c.pascalName === 'MegaMenu');
      if (uiButton) {
        uiButton.filePath = resolve('./runtime/components/MegaMenu/MegaMenu.vue');
      }
    });
  }

})
