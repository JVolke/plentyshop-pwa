// modules/matomo/index.ts
import { addPlugin, createResolver, defineNuxtModule, installModule, useRuntimeConfig } from '@nuxt/kit';
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

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.matomo = defu(
      nuxt.options.runtimeConfig.public.matomo,
      options,
    );

    nuxt.options.runtimeConfig.public.matomo.url = process.env.MATOMO_URL as string;
    nuxt.options.runtimeConfig.public.matomo.id = process.env.MATOMO_SITE_ID ? parseInt(process.env.MATOMO_SITE_ID, 10) : 0;
    nuxt.options.runtimeConfig.public.matomo.enabled = process.env?.MATOMO_ENABLED === '1';
    nuxt.options.runtimeConfig.public.matomo.debug = process.env?.MATOMO_DEBUG === '1';
    nuxt.options.runtimeConfig.public.matomo.disableCookies = process.env?.MATOMO_DISABLE_COOKIES === '1';
    nuxt.options.runtimeConfig.public.matomo.requireConsent = process.env?.MATOMO_REQUIRE_CONSENT === '1';
    nuxt.options.runtimeConfig.public.matomo.trackPageView = process.env?.MATOMO_TRACK_PAGE_VIEW !== '0';
    nuxt.options.runtimeConfig.public.matomo.trackSiteSearch = process.env?.MATOMO_TRACK_SITE_SEARCH !== '0';
    nuxt.options.runtimeConfig.public.matomo.trackEcommerce = process.env?.MATOMO_TRACK_ECOMMERCE !== '0';
    nuxt.options.runtimeConfig.public.matomo.showGrossPrices = process.env?.MATOMO_SHOW_GROSS_PRICES === '1';

    if (!nuxt.options.runtimeConfig.public.matomo.url || !nuxt.options.runtimeConfig.public.matomo.id || !nuxt.options.runtimeConfig.public.matomo.enabled) {
      return;
    }


    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'));
    // Füge das Plugin hinzu
    addPlugin({
      src: resolve('plugin.client'),
      mode: 'client',
    });
  },
});
