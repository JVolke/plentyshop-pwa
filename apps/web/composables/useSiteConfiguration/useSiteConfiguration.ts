import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadGoogleFont,
  SetTailwindColorProperties,
  SetColorPalette,
  DrawerView,
  SaveSettings,
  SettingsType,
} from '~/composables/useSiteConfiguration/types';
import type { TailwindPalette } from '~/utils/tailwindHelper';
import { getPaletteFromColor } from '~/utils/tailwindHelper';
import { metaDefaults, openGraph, favicon } from '~/configuration/app.config';
import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing site configuration.
 * @returns UseSiteConfigurationReturn
 * @example
 * ``` ts
 * const { data, drawerOpen, loading, currentFont, drawerView, settingsIsDirty, saveSettings } = UseSiteConfiguration();
 * ```
 */
export const useSiteConfiguration: UseSiteConfigurationReturn = () => {
  const runtimeConfig = useRuntimeConfig().public;

  const state = useState<UseSiteConfigurationState>('siteConfiguration', () => ({
    data: [],
    drawerOpen: false,
    pageModalOpen: false,
    settingsCategory: null,
    settingsType: null,
    loading: false,
    placement: 'left',
    newBlockPosition: 0,
    currentFont: useRuntimeConfig().public.font,
    primaryColor: useRuntimeConfig().public.primaryColor,
    secondaryColor: useRuntimeConfig().public.secondaryColor,
    iconColor: useRuntimeConfig().public.iconColor,
    headerBackgroundColor: useRuntimeConfig().public.headerBackgroundColor,
    headerLogo: useRuntimeConfig().public.headerLogo,
    favicon: structuredClone(favicon).icon,
    ogTitle: structuredClone(openGraph).title,
    ogImg: structuredClone(openGraph).image,
    useAvif: useRuntimeConfig().public.useAvif,
    useWebp: useRuntimeConfig().public.useWebp,
    seoSettings: metaDefaults,
    drawerView: null,
    blockType: '',
    blockUuid: '',
    blockSize: useRuntimeConfig().public.blockSize,
    selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
    // ANPASSUNG: Nur matomoUrl und matomoSiteId im State initialisieren
    matomoUrl: runtimeConfig.matomoUrl || '',
    matomoId: String(runtimeConfig.matomoId || 0),
    // HINZUGEFÜGT: Main Banner Einstellungen
    mainBanner: {
      desktopUrl: runtimeConfig.mainBanner?.desktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-gross.webp',
      mobileUrl: runtimeConfig.mainBanner?.mobileUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-klein.webp',
      link: runtimeConfig.mainBanner?.link || '/default-main-link',
      title: runtimeConfig.mainBanner?.title || 'Standard Hauptbanner Titel',
      alt: runtimeConfig.mainBanner?.alt || 'Standard Alt-Text für Hauptbanner',
    },

    // HINZUGEFÜGT: Secondary Banners Einstellungen (als Array von Objekten)
    // In der Initialisierung von `state`
    secondaryBanners: (runtimeConfig.secondaryBanners || []).map((banner: any, index: number) => ({
      desktopUrl: banner?.desktopUrl || `https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Banner-Links/fackeln-sand-desktop.webp`,
      link: banner?.link || `/default-banner${index + 1}-link`,
      title: banner?.title || `Standard Banner ${index + 1} Titel`,
      alt: banner?.alt || `Standard Alt-Text für Banner ${index + 1}`,
    })),
    initialData: {
      blockSize: useRuntimeConfig().public.blockSize,
      selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
      primaryColor: useRuntimeConfig().public.primaryColor,
      secondaryColor: useRuntimeConfig().public.secondaryColor,
      iconColor: useRuntimeConfig().public.iconColor,
      headerBackgroundColor: useRuntimeConfig().public.headerBackgroundColor,
      seoSettings: structuredClone(metaDefaults),
      headerLogo: useRuntimeConfig().public.headerLogo,
      favicon: structuredClone(favicon).icon,
      ogTitle: structuredClone(openGraph).title,
      ogImg: structuredClone(openGraph).image,
      useAvif: useRuntimeConfig().public.useAvif,
      useWebp: useRuntimeConfig().public.useWebp,
      // ANPASSUNG: Nur matomoUrl und matomoSiteId in initialData
      matomoUrl: runtimeConfig.matomoUrl || '',
      matomoId: String(runtimeConfig.matomoId || '0'),
      // HINZUGEFÜGT: Main Banner Einstellungen
      mainBanner: {
        desktopUrl: runtimeConfig.mainBanner?.desktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-gross.webp',
        mobileUrl: runtimeConfig.mainBanner?.mobileUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-klein.webp',
        link: runtimeConfig.mainBanner?.link || '/default-main-link',
        title: runtimeConfig.mainBanner?.title || 'Standard Hauptbanner Titel',
        alt: runtimeConfig.mainBanner?.alt || 'Standard Alt-Text für Hauptbanner',
      },

      // HINZUGEFÜGT: Secondary Banners Einstellungen (als Array von Objekten)
      secondaryBanners: (runtimeConfig.secondaryBanners || []).map((banner: any, index: number) => ({
        desktopUrl: banner?.desktopUrl || `https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Banner-Links/fackeln-sand-desktop.webp`,
        link: banner?.link || `/default-banner${index + 1}-link`,
        title: banner?.title || `Standard Banner ${index + 1} Titel`,
        alt: banner?.alt || `Standard Alt-Text für Banner ${index + 1}`,
      })),
    },

  }));

  /**
   * @description Function for loading a google font.
   * @return LoadGoogleFont
   * @example
   * ``` ts
   * loadGoogleFont('Jersey 10');
   * ```
   */
  const loadGoogleFont: LoadGoogleFont = (fontName: string) => {
    const link = document.createElement('link');

    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    state.value.currentFont = `font-family: '${fontName}'`;
  };

  const setColorProperties: SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => {
    tailwindPalette.forEach((shade) => {
      if (shade.rgb) {
        document.documentElement.style.setProperty(`--colors-2-${type}-${shade.weight}`, shade.rgb);
      }
    });
  };

  const updatePrimaryColor: SetColorPalette = (hexColor: string) => {
    const tailwindColors: TailwindPalette = getPaletteFromColor('primary', hexColor).map((color) => ({
      ...color,
    }));

    setColorProperties('primary', tailwindColors);
  };

  const updateSecondaryColor: SetColorPalette = (hexColor: string) => {
    const tailwindColors: TailwindPalette = getPaletteFromColor('secondary', hexColor).map((color) => ({
      ...color,
    }));

    setColorProperties('secondary', tailwindColors);
  };

  const updateHeaderBackgroundColor: SetColorPalette = (hexColor: string) => {
    const tailwindColors: TailwindPalette = getPaletteFromColor('header', hexColor).map((color) => ({
      ...color,
    }));

    setColorProperties('header', tailwindColors);
  };

  watch(
    () => state.value.primaryColor,
    (newValue) => {
      updatePrimaryColor(newValue);
    },
  );

  watch(
    () => state.value.secondaryColor,
    (newValue) => {
      updateSecondaryColor(newValue);
    },
  );

  watch(
    () => state.value.headerBackgroundColor,
    (newValue) => {
      updateHeaderBackgroundColor(newValue);
    },
  );

  const openDrawerWithView = (view: DrawerView, block?: Block) => {
    if (block) {
      state.value.blockType = block.name;
      state.value.blockUuid = block.meta.uuid;
    }

    state.value.drawerView = view;
    state.value.drawerOpen = true;

    state.value.placement = view === 'blocksSettings' ? 'right' : 'left';
  };

  const closeDrawer = () => {
    state.value.drawerOpen = false;
    state.value.drawerView = null;
  };

  const updateBlockSize: UpdateBlockSize = (size: string) => {
    state.value.blockSize = size;
  };

  const updateNewBlockPosition = (position: number) => {
    state.value.newBlockPosition = position;
  };

  const settingsIsDirty = computed(() => {
     if (
      state.value.blockSize !== state.value.initialData.blockSize ||
      state.value.primaryColor !== state.value.initialData.primaryColor ||
      state.value.secondaryColor !== state.value.initialData.secondaryColor ||
      state.value.iconColor !== state.value.initialData.iconColor ||
      state.value.headerBackgroundColor !== state.value.initialData.headerBackgroundColor ||
      state.value.headerLogo !== state.value.initialData.headerLogo ||
      state.value.favicon !== state.value.initialData.favicon ||
      state.value.ogTitle !== state.value.initialData.ogTitle ||
      state.value.ogImg !== state.value.initialData.ogImg ||
      state.value.useAvif !== state.value.initialData.useAvif ||
      state.value.useWebp !== state.value.initialData.useWebp ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont) ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont) ||
      JSON.stringify(state.value.seoSettings) !== JSON.stringify(state.value.initialData.seoSettings) ||
    // ANPASSUNG: Nur matomoUrl und matomoSiteId in settingsIsDirty
    state.value.matomoUrl !== state.value.initialData.matomoUrl ||
    state.value.matomoId !== state.value.initialData.matomoId
    ) { return true }
    // Hauptbanner-Prüfung
    if (state.value.mainBanner.desktopUrl !== state.value.initialData.mainBanner.desktopUrl ||
      state.value.mainBanner.mobileUrl !== state.value.initialData.mainBanner.mobileUrl ||
      state.value.mainBanner.link !== state.value.initialData.mainBanner.link ||
      state.value.mainBanner.title !== state.value.initialData.mainBanner.title ||
      state.value.mainBanner.alt !== state.value.initialData.mainBanner.alt) {
      return true;
    }

    // Sekundärbanner-Prüfung (tiefgreifender Vergleich)
    if (state.value.secondaryBanners.length !== state.value.initialData.secondaryBanners.length) {
      return true; // Längenunterschied
    }
    for (let i = 0; i < state.value.secondaryBanners.length; i++) {
      const current = state.value.secondaryBanners[i];
      const initial = state.value.initialData.secondaryBanners[i];
      if (current.desktopUrl !== initial.desktopUrl ||
        current.link !== initial.link ||
        current.title !== initial.title ||
        current.alt !== initial.alt) {
        return true;
      }
    }
    return false;
  });

  const saveSettings: SaveSettings = async (): Promise<boolean> => {
    try {
      state.value.loading = true;

      const settings = [
        {
          key: 'blockSize',
          value: state.value.blockSize,
        },
        {
          key: 'font',
          value: state.value.selectedFont.value,
        },
        {
          key: 'primaryColor',
          value: state.value.primaryColor,
        },
        {
          key: 'secondaryColor',
          value: state.value.secondaryColor,
        },
        {
          key: 'headerLogo',
          value: state.value.headerLogo,
        },
        {
          key: 'favicon',
          value: state.value.favicon,
        },
        {
          key: 'ogTitle',
          value: state.value.ogTitle,
        },
        {
          key: 'ogImg',
          value: state.value.ogImg,
        },
        {
          key: 'useAvif',
          value: state.value.useAvif ? 'true' : 'false',
        },
        {
          key: 'useWebp',
          value: state.value.useWebp ? 'true' : 'false',
        },
        {
          key: 'metaTitle',
          value: state.value.seoSettings.title,
        },
        {
          key: 'metaDescription',
          value: state.value.seoSettings.description,
        },
        {
          key: 'metaKeywords',
          value: state.value.seoSettings.keywords,
        },
        {
          key: 'robots',
          value: state.value.seoSettings.robots,
        },
        {
          key: 'iconColor',
          value: state.value.iconColor,
        },
        {
          key: 'headerBackgroundColor',
          value: state.value.headerBackgroundColor,
        },
        // ANPASSUNG: Nur matomoUrl und matomoSiteId beim Speichern
        {
          key: 'matomoUrl',
          value: state.value.matomoUrl,
        },
        {
          key: 'matomoId',
          value: state.value.matomoId, // <-- Bleibt String
        },

        // HINZUGEFÜGT: Main Banner Einstellungen (unpräfixiert an Plenty senden)
        { key: 'mainBanner.desktopUrl', value: state.value.mainBanner.desktopUrl },
        { key: 'mainBanner.mobileUrl', value: state.value.mainBanner.mobileUrl },
        { key: 'mainBanner.link', value: state.value.mainBanner.link },
        { key: 'mainBanner.title', value: state.value.mainBanner.title },
        { key: 'mainBanner.alt', value: state.value.mainBanner.alt },

        // HINZUGEFÜGT: Secondary Banners Einstellungen (unpräfixiert an Plenty senden, geflachte Keys)
        { key: 'secondaryBanners.0.desktopUrl', value: state.value.secondaryBanners[0].desktopUrl },
        { key: 'secondaryBanners.0.link', value: state.value.secondaryBanners[0].link },
        { key: 'secondaryBanners.0.title', value: state.value.secondaryBanners[0].title },
        { key: 'secondaryBanners.0.alt', value: state.value.secondaryBanners[0].alt },

        { key: 'secondaryBanners.1.desktopUrl', value: state.value.secondaryBanners[1].desktopUrl },
        { key: 'secondaryBanners.1.link', value: state.value.secondaryBanners[1].link },
        { key: 'secondaryBanners.1.title', value: state.value.secondaryBanners[1].title },
        { key: 'secondaryBanners.1.alt', value: state.value.secondaryBanners[1].alt },

        { key: 'secondaryBanners.2.desktopUrl', value: state.value.secondaryBanners[2].desktopUrl },
        { key: 'secondaryBanners.2.link', value: state.value.secondaryBanners[2].link },
        { key: 'secondaryBanners.2.title', value: state.value.secondaryBanners[2].title },
        { key: 'secondaryBanners.2.alt', value: state.value.secondaryBanners[2].alt },
      ];

      await useSdk().plentysystems.setConfiguration({ settings });

      state.value.initialData = {
        blockSize: state.value.blockSize,
        selectedFont: { caption: state.value.selectedFont.value, value: state.value.selectedFont.value },
        primaryColor: state.value.primaryColor,
        secondaryColor: state.value.secondaryColor,
        iconColor: state.value.iconColor,
        headerBackgroundColor: state.value.headerBackgroundColor,
        headerLogo: state.value.headerLogo,
        favicon: state.value.favicon,
        ogTitle: state.value.ogTitle,
        ogImg: state.value.ogImg,
        useAvif: state.value.useAvif,
        useWebp: state.value.useWebp,
        seoSettings: state.value.seoSettings,
        // ANPASSUNG: Nur matomoUrl und matomoSiteId in initialData
        matomoUrl: state.value.matomoUrl,
        matomoId: state.value.matomoId,
        mainBanner: state.value.mainBanner,
        secondaryBanners: state.value.secondaryBanners,
      };
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      state.value.loading = false;
    }
    return true;
  };

  const togglePageModal = (value: boolean) => {
    state.value.pageModalOpen = value;
  };

  const setSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => {
    state.value.settingsType = settingsType || null;
    state.value.settingsCategory = category;
  };

  return {
    updatePrimaryColor,
    updateSecondaryColor,
    updateHeaderBackgroundColor,
    ...toRefs(state.value),
    updateNewBlockPosition,
    loadGoogleFont,
    updateBlockSize,
    openDrawerWithView,
    closeDrawer,
    settingsIsDirty,
    saveSettings,
    togglePageModal,
    setSettingsCategory,
  };
};
