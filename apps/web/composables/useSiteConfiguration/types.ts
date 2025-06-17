import type { TailwindPalette } from '~/utils/tailwindHelper';
import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';
export type DrawerView =
  | 'SettingsView'
  | 'blocksList'
  | 'DesignView'
  | 'SeoView'
  | 'PagesView'
  | 'blocksSettings'
  | 'MatomoSettings'
  | 'BannerSettings'
  | null;

export type SettingsType = 'general-settings' | 'seo-settings' | 'general-menu' | null;
export type SelectedFont = { caption: string; value: string };

export type ConfigurationSettings = {
  blockSize: string;
  selectedFont: SelectedFont;
  primaryColor: string;
  secondaryColor: string;
  headerBackgroundColor: string;
  iconColor: string;
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
    robots: string;
  };
  matomoUrl: string;
  matomoId: string; // Geändert zu String
  // HINZUGEFÜGT: FLATE Banner-Einstellungen
  mainBannerDesktopUrl: string;
  mainBannerMobileUrl: string;
  mainBannerLink: string;
  mainBannerTitle: string;
  mainBannerAlt: string;
  secondaryBanner1DesktopUrl: string;
  secondaryBanner1Link: string;
  secondaryBanner1Title: string;
  secondaryBanner1Alt: string;
  secondaryBanner2DesktopUrl: string;
  secondaryBanner2Link: string;
  secondaryBanner2Title: string;
  secondaryBanner2Alt: string;
  secondaryBanner3DesktopUrl: string;
  secondaryBanner3Link: string;
  secondaryBanner3Title: string;
  secondaryBanner3Alt: string;
};

export interface UseSiteConfigurationState {
  data: [];
  loading: boolean;
  settingsCategory: CategoryTreeItem | null;
  settingsType: SettingsType;
  drawerOpen: boolean;
  pageModalOpen: boolean;
  newBlockPosition: number;
  currentFont: string;
  primaryColor: string;
  secondaryColor: string;
  headerBackgroundColor: string;
  iconColor: string;
  headerLogo: string;
  favicon: string;
  ogTitle: string;
  ogImg: string;
  useAvif: boolean;
  useWebp: boolean;
  selectedFont: SelectedFont;
  blockSize: string;
  placement: string;
  drawerView: DrawerView;
  blockType: string;
  blockUuid: string;
  initialData: ConfigurationSettings;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
    robots: string;
  };
  // NEUE Matomo-Einstellungen im State
  matomoUrl: string;
  matomoId: string;
  // HINZUGEFÜGT: FLATE Banner-Einstellungen im State
  mainBannerDesktopUrl: string;
  mainBannerMobileUrl: string;
  mainBannerLink: string;
  mainBannerTitle: string;
  mainBannerAlt: string;
  secondaryBanner1DesktopUrl: string;
  secondaryBanner1Link: string;
  secondaryBanner1Title: string;
  secondaryBanner1Alt: string;
  secondaryBanner2DesktopUrl: string;
  secondaryBanner2Link: string;
  secondaryBanner2Title: string;
  secondaryBanner2Alt: string;
  secondaryBanner3DesktopUrl: string;
  secondaryBanner3Link: string;
  secondaryBanner3Title: string;
  secondaryBanner3Alt: string;
}

export type LoadGoogleFont = (font: string) => void;
export type UpdateBlockSize = (size: string) => void;
export type UpdateNewBlockPosition = (position: number) => void;
export type SetTailwindColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type SetColorPalette = (hexColor: string) => void;
export type OpenDrawerView = (view: DrawerView, block?: Block) => void;
export type SaveSettings = () => Promise<boolean>;
export type TogglePageModal = (value: boolean) => void;
export type SetSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => void;

export interface UseSiteConfiguration {
  data: Readonly<Ref<UseSiteConfigurationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  drawerOpen: Readonly<Ref<UseSiteConfigurationState['drawerOpen']>>;
  settingsCategory: Readonly<Ref<UseSiteConfigurationState['settingsCategory']>>;
  settingsType: Readonly<Ref<UseSiteConfigurationState['settingsType']>>;
  pageModalOpen: Readonly<Ref<UseSiteConfigurationState['pageModalOpen']>>;
  blockType: Readonly<Ref<UseSiteConfigurationState['blockType']>>;
  blockUuid: Readonly<Ref<UseSiteConfigurationState['blockUuid']>>;
  newBlockPosition: Readonly<Ref<UseSiteConfigurationState['newBlockPosition']>>;
  currentFont: Readonly<Ref<UseSiteConfigurationState['currentFont']>>;
  primaryColor: Readonly<Ref<UseSiteConfigurationState['primaryColor']>>;
  secondaryColor: Readonly<Ref<UseSiteConfigurationState['secondaryColor']>>;
  headerBackgroundColor: Readonly<Ref<UseSiteConfigurationState['headerBackgroundColor']>>;
  iconColor: Readonly<Ref<UseSiteConfigurationState['iconColor']>>;
  headerLogo: Readonly<Ref<UseSiteConfigurationState['headerLogo']>>;
  favicon: Readonly<Ref<UseSiteConfigurationState['favicon']>>;
  ogTitle: Readonly<Ref<UseSiteConfigurationState['ogTitle']>>;
  ogImg: Readonly<Ref<UseSiteConfigurationState['ogImg']>>;
  useAvif: Readonly<Ref<UseSiteConfigurationState['useAvif']>>;
  useWebp: Readonly<Ref<UseSiteConfigurationState['useWebp']>>;
  blockSize: Readonly<Ref<UseSiteConfigurationState['blockSize']>>;
  seoSettings: Readonly<Ref<UseSiteConfigurationState['seoSettings']>>;
  placement: Readonly<Ref<UseSiteConfigurationState['placement']>>;
  drawerView: Readonly<Ref<UseSiteConfigurationState['drawerView']>>;
  selectedFont: Readonly<Ref<UseSiteConfigurationState['selectedFont']>>;
  initialData: Readonly<Ref<UseSiteConfigurationState['initialData']>>;
  // NEUE Matomo-Einstellungen ebenfalls als Readonly<Ref> hinzufügen
  matomoUrl: Readonly<Ref<UseSiteConfigurationState['matomoUrl']>>;
  matomoId: Readonly<Ref<UseSiteConfigurationState['matomoId']>>;
  // HINZUGEFÜGT: FLATE Banner-Einstellungen als Readonly<Ref>
  mainBannerDesktopUrl: Readonly<Ref<UseSiteConfigurationState['mainBannerDesktopUrl']>>;
  mainBannerMobileUrl: Readonly<Ref<UseSiteConfigurationState['mainBannerMobileUrl']>>;
  mainBannerLink: Readonly<Ref<UseSiteConfigurationState['mainBannerLink']>>;
  mainBannerTitle: Readonly<Ref<UseSiteConfigurationState['mainBannerTitle']>>;
  mainBannerAlt: Readonly<Ref<UseSiteConfigurationState['mainBannerAlt']>>;
  secondaryBanner1DesktopUrl: Readonly<Ref<UseSiteConfigurationState['secondaryBanner1DesktopUrl']>>;
  secondaryBanner1Link: Readonly<Ref<UseSiteConfigurationState['secondaryBanner1Link']>>;
  secondaryBanner1Title: Readonly<Ref<UseSiteConfigurationState['secondaryBanner1Title']>>;
  secondaryBanner1Alt: Readonly<Ref<UseSiteConfigurationState['secondaryBanner1Alt']>>;
  secondaryBanner2DesktopUrl: Readonly<Ref<UseSiteConfigurationState['secondaryBanner2DesktopUrl']>>;
  secondaryBanner2Link: Readonly<Ref<UseSiteConfigurationState['secondaryBanner2Link']>>;
  secondaryBanner2Title: Readonly<Ref<UseSiteConfigurationState['secondaryBanner2Title']>>;
  secondaryBanner2Alt: Readonly<Ref<UseSiteConfigurationState['secondaryBanner2Alt']>>;
  secondaryBanner3DesktopUrl: Readonly<Ref<UseSiteConfigurationState['secondaryBanner3DesktopUrl']>>;
  secondaryBanner3Link: Readonly<Ref<UseSiteConfigurationState['secondaryBanner3Link']>>;
  secondaryBanner3Title: Readonly<Ref<UseSiteConfigurationState['secondaryBanner3Title']>>;
  secondaryBanner3Alt: Readonly<Ref<UseSiteConfigurationState['secondaryBanner3Alt']>>;
  // ... Rest der UseSiteConfiguration bleibt unverändert ...
  updateNewBlockPosition: UpdateNewBlockPosition;
  loadGoogleFont: LoadGoogleFont;
  updatePrimaryColor: SetColorPalette;
  updateSecondaryColor: SetColorPalette;
  updateHeaderBackgroundColor: SetColorPalette;
  updateBlockSize: UpdateBlockSize;
  saveSettings: SaveSettings;
  openDrawerWithView: OpenDrawerView;
  togglePageModal: TogglePageModal;
  setSettingsCategory: SetSettingsCategory;
  closeDrawer: () => void;
  settingsIsDirty: ComputedRef<boolean>;
}

export type UseSiteConfigurationReturn = () => UseSiteConfiguration;
