// modules/matomo/index.ts
import { addComponent, addPlugin, createResolver, defineNuxtModule, installModule } from '@nuxt/kit';
import { defu } from 'defu';

export interface ModuleOptions {
  url: string;
  id: string;
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
    id: '0',
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
    const { resolve } = createResolver(import.meta.url);

    // Installiere optionale Module (angenommen, E-Commerce-Funktionen sind relevant)
    await installModule('@plentymarkets/shop-core').catch(() => {});


    nuxt.options.runtimeConfig.public.matomoUrl = process.env.NUXT_PUBLIC_MATOMO_URL as string;
    nuxt.options.runtimeConfig.public.matomoId = process.env.NUXT_PUBLIC_MATOMO_ID || '0';
    nuxt.options.runtimeConfig.public.matomoEnabled = process.env?.NUXT_PUBLIC_MATOMO_ENABLED === '1';
    nuxt.options.runtimeConfig.public.matomoDebug = process.env?.NUXT_PUBLIC_MATOMO_DEBUG === '1';
    nuxt.options.runtimeConfig.public.matomoDisableCookies = process.env?.NUXT_PUBLIC_MATOMO_DISABLE_COOKIES === '1';
    nuxt.options.runtimeConfig.public.matomoRequireConsent = process.env?.NUXT_PUBLIC_MATOMO_REQUIRE_CONSENT === '1';
    nuxt.options.runtimeConfig.public.matomoTrackPageView = process.env?.NUXT_PUBLIC_MATOMO_TRACK_PAGE_VIEW !== '0';
    nuxt.options.runtimeConfig.public.matomoTrackSiteSearch = process.env?.NUXT_PUBLIC_MATOMO_TRACK_SITE_SEARCH !== '0';
    nuxt.options.runtimeConfig.public.matomoTrackEcommerce = process.env?.NUXT_PUBLIC_MATOMO_TRACK_ECOMMERCE !== '0';
    nuxt.options.runtimeConfig.public.matomoShowGrossPrices = process.env?.NUXT_PUBLIC_MATOMO_SHOW_GROSS_PRICES === '1';

    /**if (!nuxt.options.runtimeConfig.public.matomoUrl || !nuxt.options.runtimeConfig.public.matomoId || !nuxt.options.runtimeConfig.public.matomoEnabled) {
      return;
    }*/
    addComponent({
      name: 'MatomoSettingsDrawer',
      filePath: resolve('./runtime/components/MatomoSettingsDrawer.vue'),
    });

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'));

    // Füge das Plugin hinzu
    addPlugin({
      src: resolve('plugin.server'),
      mode: 'server',
    });
    addPlugin({
      src: resolve('plugin.client'),
      mode: 'client',
    });

  },
});
