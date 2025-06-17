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

    // HINZUGEFÜGT: FLATE Banner-Einstellungen
    mainBannerDesktopUrl: runtimeConfig.mainBannerDesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-gross.webp',
    mainBannerMobileUrl: runtimeConfig.mainBannerMobileUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-klein.webp',
    mainBannerLink: runtimeConfig.mainBannerLink || '/default-main-link',
    mainBannerTitle: runtimeConfig.mainBannerTitle || 'Standard Hauptbanner Titel',
    mainBannerAlt: runtimeConfig.mainBannerAlt || 'Standard Alt-Text für Hauptbanner',

    secondaryBanner1DesktopUrl: runtimeConfig.secondaryBanner1DesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Banner-Links/fackeln-sand-desktop.webp',
    secondaryBanner1Link: runtimeConfig.secondaryBanner1Link || '/default-banner1-link',
    secondaryBanner1Title: runtimeConfig.secondaryBanner1Title || 'Standard Banner 1 Titel',
    secondaryBanner1Alt: runtimeConfig.secondaryBanner1Alt || 'Standard Alt-Text für Banner 1',

    secondaryBanner2DesktopUrl: runtimeConfig.secondaryBanner2DesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Banner-Links/schulanfang-2022-desktop.jpg',
    secondaryBanner2Link: runtimeConfig.secondaryBanner2Link || '/default-banner2-link',
    secondaryBanner2Title: runtimeConfig.secondaryBanner2Title || 'Standard Banner 2 Titel',
    secondaryBanner2Alt: runtimeConfig.secondaryBanner2Alt || 'Standard Alt-Text für Banner 2',

    secondaryBanner3DesktopUrl: runtimeConfig.secondaryBanner3DesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Kategorie-Startseite/2025/Banner-schmal_Baumscheiben-personalisiert.webp',
    secondaryBanner3Link: runtimeConfig.secondaryBanner3Link || '/default-banner3-link',
    secondaryBanner3Title: runtimeConfig.secondaryBanner3Title || 'Standard Banner 3 Titel',
    secondaryBanner3Alt: runtimeConfig.secondaryBanner3Alt || 'Standard Alt-Text für Banner 3',

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
      // HINZUGEFÜGT: FLATE Banner-Einstellungen in initialData
      mainBannerDesktopUrl: runtimeConfig.mainBannerDesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-gross.webp',
      mainBannerMobileUrl: runtimeConfig.mainBannerMobileUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Hauptteaser/2025/Kindertag-klein.webp',
      mainBannerLink: runtimeConfig.mainBannerLink || '/default-main-link',
      mainBannerTitle: runtimeConfig.mainBannerTitle || 'Standard Hauptbanner Titel',
      mainBannerAlt: runtimeConfig.mainBannerAlt || 'Standard Alt-Text für Hauptbanner',

      secondaryBanner1DesktopUrl: runtimeConfig.secondaryBanner1DesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Banner-Links/fackeln-sand-desktop.webp',
      secondaryBanner1Link: runtimeConfig.secondaryBanner1Link || '/default-banner1-link',
      secondaryBanner1Title: runtimeConfig.secondaryBanner1Title || 'Standard Banner 1 Titel',
      secondaryBanner1Alt: runtimeConfig.secondaryBanner1Alt || 'Standard Alt-Text für Banner 1',

      secondaryBanner2DesktopUrl: runtimeConfig.secondaryBanner2DesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Banner-Links/schulanfang-2022-desktop.jpg',
      secondaryBanner2Link: runtimeConfig.secondaryBanner2Link || '/default-banner2-link',
      secondaryBanner2Title: runtimeConfig.secondaryBanner2Title || 'Standard Banner 2 Titel',
      secondaryBanner2Alt: runtimeConfig.secondaryBanner2Alt || 'Standard Alt-Text für Banner 2',

      secondaryBanner3DesktopUrl: runtimeConfig.secondaryBanner3DesktopUrl || 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/KF-Onlineshop/Kategorie-Startseite/2025/Banner-schmal_Baumscheiben-personalisiert.webp',
      secondaryBanner3Link: runtimeConfig.secondaryBanner3Link || '/default-banner3-link',
      secondaryBanner3Title: runtimeConfig.secondaryBanner3Title || 'Standard Banner 3 Titel',
      secondaryBanner3Alt: runtimeConfig.secondaryBanner3Alt || 'Standard Alt-Text für Banner 3',
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
    // HINZUGEFÜGT: FLATE Banner-Prüfung
    if (
      state.value.mainBannerDesktopUrl !== state.value.initialData.mainBannerDesktopUrl ||
      state.value.mainBannerMobileUrl !== state.value.initialData.mainBannerMobileUrl ||
      state.value.mainBannerLink !== state.value.initialData.mainBannerLink ||
      state.value.mainBannerTitle !== state.value.initialData.mainBannerTitle ||
      state.value.mainBannerAlt !== state.value.initialData.mainBannerAlt ||
      state.value.secondaryBanner1DesktopUrl !== state.value.initialData.secondaryBanner1DesktopUrl ||
      state.value.secondaryBanner1Link !== state.value.initialData.secondaryBanner1Link ||
      state.value.secondaryBanner1Title !== state.value.initialData.secondaryBanner1Title ||
      state.value.secondaryBanner1Alt !== state.value.initialData.secondaryBanner1Alt ||
      state.value.secondaryBanner2DesktopUrl !== state.value.initialData.secondaryBanner2DesktopUrl ||
      state.value.secondaryBanner2Link !== state.value.initialData.secondaryBanner2Link ||
      state.value.secondaryBanner2Title !== state.value.initialData.secondaryBanner2Title ||
      state.value.secondaryBanner2Alt !== state.value.initialData.secondaryBanner2Alt ||
      state.value.secondaryBanner3DesktopUrl !== state.value.initialData.secondaryBanner3DesktopUrl ||
      state.value.secondaryBanner3Link !== state.value.initialData.secondaryBanner3Link ||
      state.value.secondaryBanner3Title !== state.value.initialData.secondaryBanner3Title ||
      state.value.secondaryBanner3Alt !== state.value.initialData.secondaryBanner3Alt
    ) {
      return true;
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
        // HINZUGEFÜGT: FLATE Banner-Einstellungen beim Speichern
        { key: 'mainBannerDesktopUrl', value: state.value.mainBannerDesktopUrl },
        { key: 'mainBannerMobileUrl', value: state.value.mainBannerMobileUrl },
        { key: 'mainBannerLink', value: state.value.mainBannerLink },
        { key: 'mainBannerTitle', value: state.value.mainBannerTitle },
        { key: 'mainBannerAlt', value: state.value.mainBannerAlt },

        { key: 'secondaryBanner1DesktopUrl', value: state.value.secondaryBanner1DesktopUrl },
        { key: 'secondaryBanner1Link', value: state.value.secondaryBanner1Link },
        { key: 'secondaryBanner1Title', value: state.value.secondaryBanner1Title },
        { key: 'secondaryBanner1Alt', value: state.value.secondaryBanner1Alt },

        { key: 'secondaryBanner2DesktopUrl', value: state.value.secondaryBanner2DesktopUrl },
        { key: 'secondaryBanner2Link', value: state.value.secondaryBanner2Link },
        { key: 'secondaryBanner2Title', value: state.value.secondaryBanner2Title },
        { key: 'secondaryBanner2Alt', value: state.value.secondaryBanner2Alt },

        { key: 'secondaryBanner3DesktopUrl', value: state.value.secondaryBanner3DesktopUrl },
        { key: 'secondaryBanner3Link', value: state.value.secondaryBanner3Link },
        { key: 'secondaryBanner3Title', value: state.value.secondaryBanner3Title },
        { key: 'secondaryBanner3Alt', value: state.value.secondaryBanner3Alt },
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
        // HINZUGEFÜGT: FLATE Banner-Einstellungen in initialData
        mainBannerDesktopUrl: state.value.mainBannerDesktopUrl,
        mainBannerMobileUrl: state.value.mainBannerMobileUrl,
        mainBannerLink: state.value.mainBannerLink,
        mainBannerTitle: state.value.mainBannerTitle,
        mainBannerAlt: state.value.mainBannerAlt,

        secondaryBanner1DesktopUrl: state.value.secondaryBanner1DesktopUrl,
        secondaryBanner1Link: state.value.secondaryBanner1Link,
        secondaryBanner1Title: state.value.secondaryBanner1Title,
        secondaryBanner1Alt: state.value.secondaryBanner1Alt,

        secondaryBanner2DesktopUrl: state.value.secondaryBanner2DesktopUrl,
        secondaryBanner2Link: state.value.secondaryBanner2Link,
        secondaryBanner2Title: state.value.secondaryBanner2Title,
        secondaryBanner2Alt: state.value.secondaryBanner2Alt,

        secondaryBanner3DesktopUrl: state.value.secondaryBanner3DesktopUrl,
        secondaryBanner3Link: state.value.secondaryBanner3Link,
        secondaryBanner3Title: state.value.secondaryBanner3Title,
        secondaryBanner3Alt: state.value.secondaryBanner3Alt,
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
