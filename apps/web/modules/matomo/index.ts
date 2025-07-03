// modules/matomo/index.ts
import { addComponent, addPlugin, createResolver, defineNuxtModule, installModule, updateRuntimeConfig  } from '@nuxt/kit';
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
    updateRuntimeConfig({
      public: {
        matomoUrl: '',
        matomoId: '',
        matomoEnabled: true,
        matomoDebug: false,
        matomoDisableCookies: true,
        matomoRequireConsent: '1',
        matomoTrackPageView: true,
        matomoTrackSiteSearch: true,
        matomoTrackEcommerce: true,
        matomoShowGrossPrices: false,
      },
    });

    // Installiere optionale Module (angenommen, E-Commerce-Funktionen sind relevant)
    await installModule('@plentymarkets/shop-core').catch(() => {});

    /**if (!nuxt.options.runtimeConfig.public.matomoUrl || !nuxt.options.runtimeConfig.public.matomoId || !nuxt.options.runtimeConfig.public.matomoEnabled) {
      return;
    }*/

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
