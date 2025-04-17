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
  const state = useState<UseSiteConfigurationState>('siteConfiguration', () => ({
    data: [],
    drawerOpen: false,
    pageModalOpen: false,
    settingsCategory: null,
    settingsType: null,
    unlinkModalOpen: false,
    loading: false,
    placement: 'left',
    newBlockPosition: 0,
    currentFont: useRuntimeConfig().public.font,
    primaryColor: useRuntimeConfig().public.primaryColor,
    secondaryColor: useRuntimeConfig().public.secondaryColor,
    drawerView: null,
    blockType: '',
    blockUuid: '',
    blockSize: useRuntimeConfig().public.blockSize,
    selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
    initialData: {
      blockSize: useRuntimeConfig().public.blockSize,
      selectedFont: { caption: useRuntimeConfig().public.font, value: useRuntimeConfig().public.font },
      primaryColor: useRuntimeConfig().public.primaryColor,
      secondaryColor: useRuntimeConfig().public.secondaryColor,
    },
    matomo: {
      url: useRuntimeConfig().public.matomo.url,
      id: useRuntimeConfig().public.matomo.id,
      enabled: useRuntimeConfig().public.matomo.enabled,
      debug: useRuntimeConfig().public.matomo.debug,
      disableCookies: useRuntimeConfig().public.matomo.disableCookies,
      requireConsent: useRuntimeConfig().public.matomo.requireConsent,
      trackPageView: useRuntimeConfig().public.matomo.trackPageView,
      trackSiteSearch: useRuntimeConfig().public.matomo.trackSiteSearch,
      trackEcommerce: useRuntimeConfig().public.matomo.trackEcommerce,
      showGrossPrices: useRuntimeConfig().public.matomo.showGrossPrices,
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
    return (
      state.value.blockSize !== state.value.initialData.blockSize ||
      state.value.primaryColor !== state.value.initialData.primaryColor ||
      state.value.secondaryColor !== state.value.initialData.secondaryColor ||
      JSON.stringify(state.value.selectedFont) !== JSON.stringify(state.value.initialData.selectedFont)
    );
  });

  const saveSettings: SaveSettings = async (): Promise<boolean> => {
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
        key: 'matomo.url', // Verwende die Punktnotation, falls die API das erwartet
        value: state.value.matomo.url,
      },
      {
        key: 'matomo.id',
        value: String(state.value.matomo.id),
      },
      {
        key: 'matomo.enabled',
        value: String(state.value.matomo.enabled),
      },
      {
        key: 'matomo.debug',
        value: String(state.value.matomo.debug),
      },
      {
        key: 'matomo.disableCookies',
        value: String(state.value.matomo.disableCookies),
      },
      {
        key: 'matomo.requireConsent',
        value: String(state.value.matomo.requireConsent),
      },
      {
        key: 'matomo.trackPageView',
        value: String(state.value.matomo.trackPageView),
      },
      {
        key: 'matomo.trackSiteSearch',
        value: String(state.value.matomo.trackSiteSearch),
      },
      {
        key: 'matomo.trackEcommerce',
        value: String(state.value.matomo.trackEcommerce),
      },
      {
        key: 'matomo.showGrossPrices',
        value: String(state.value.matomo.showGrossPrices),
      },
    ];
    const { error } = await useAsyncData(() => useSdk().plentysystems.setConfiguration({ settings }));

    if (error.value) {
      state.value.loading = false;
      return false;
    }

    state.value.initialData = {
      blockSize: state.value.blockSize,
      selectedFont: { caption: state.value.selectedFont.value, value: state.value.selectedFont.value },
      primaryColor: state.value.primaryColor,
      secondaryColor: state.value.secondaryColor,
    };

    state.value.matomo = {
        url: state.value.matomo.url,
        id: state.value.matomo.id,
        enabled: state.value.matomo.enabled,
        debug: state.value.matomo.debug,
        disableCookies: state.value.matomo.disableCookies,
        requireConsent: state.value.matomo.requireConsent,
        trackPageView: state.value.matomo.trackPageView,
        trackSiteSearch: state.value.matomo.trackSiteSearch,
        trackEcommerce: state.value.matomo.trackEcommerce,
        showGrossPrices: state.value.matomo.showGrossPrices,
    }

    state.value.loading = false;
    return true;
  };

  const togglePageModal = (value: boolean) => {
    state.value.pageModalOpen = value;
  };

  const toggleDeleteModal = (value: boolean) => {
    state.value.unlinkModalOpen = value;
  };
  const setSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => {
    state.value.settingsType = settingsType || null;
    state.value.settingsCategory = category;
  };

  return {
    updatePrimaryColor,
    updateSecondaryColor,
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
    toggleDeleteModal,
  };
};
