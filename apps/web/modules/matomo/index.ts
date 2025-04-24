// modules/matomo/index.ts
import { addComponent, addPlugin, createResolver, defineNuxtModule, installModule, useRuntimeConfig } from '@nuxt/kit';
import { defu } from 'defu';

export interface ModuleOptions {
  url: string;
  id: number;
  enabled?: boolean;
  debug?: boolean;
  disableCookies?: boolean;
  requireConsent?: boolean;
  trackPageView?: boolean;
  trackSiteSearch?: boolean;
  trackEcommerce?: boolean;
  showGrossPrices?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'krause-sohn-matomo',
    configKey: 'matomo',
  },
  defaults: {
    url: '',
    id: 0,
    enabled: true,
    debug: false,
    disableCookies: false,
    requireConsent: false,
    trackPageView: true,
    trackSiteSearch: false,
    trackEcommerce: false,
    showGrossPrices: false,
  },
  async setup(options, nuxt) {
    console.log("Setup function")
    const { resolve } = createResolver(import.meta.url);

    // Installiere optionale Module (angenommen, E-Commerce-Funktionen sind relevant)
    await installModule('@plentymarkets/shop-core').catch(() => {});


    nuxt.options.runtimeConfig.public.matomoUrl = process.env.MATOMO_URL as string;
    nuxt.options.runtimeConfig.public.matomoId = process.env.MATOMO_SITE_ID ? parseInt(process.env.MATOMO_SITE_ID, 10) : 0;
    nuxt.options.runtimeConfig.public.matomoEnabled = process.env?.MATOMO_ENABLED === '1';
    nuxt.options.runtimeConfig.public.matomoDebug = process.env?.MATOMO_DEBUG === '1';
    nuxt.options.runtimeConfig.public.matomoDisableCookies = process.env?.MATOMO_DISABLE_COOKIES === '1';
    nuxt.options.runtimeConfig.public.matomoRequireConsent = process.env?.MATOMO_REQUIRE_CONSENT === '1';
    nuxt.options.runtimeConfig.public.matomoTrackPageView = process.env?.MATOMO_TRACK_PAGE_VIEW !== '0';
    nuxt.options.runtimeConfig.public.matomoTrackSiteSearch = process.env?.MATOMO_TRACK_SITE_SEARCH !== '0';
    nuxt.options.runtimeConfig.public.matomoTrackEcommerce = process.env?.MATOMO_TRACK_ECOMMERCE !== '0';
    nuxt.options.runtimeConfig.public.matomoShowGrossPrices = process.env?.MATOMO_SHOW_GROSS_PRICES === '1';

    /**if (!nuxt.options.runtimeConfig.public.matomoUrl || !nuxt.options.runtimeConfig.public.matomoId || !nuxt.options.runtimeConfig.public.matomoEnabled) {
      return;
    }*/


    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'));

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

    addComponent({
      name: 'MatomoSettings',
      filePath: resolve('./runtime/components/MatomoSettings.vue'),
    });

    // Füge das Plugin hinzu
    addPlugin({
      src: resolve('plugin.client'),
      mode: 'client',
    });
  },
});
