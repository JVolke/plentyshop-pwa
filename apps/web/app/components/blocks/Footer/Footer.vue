<template>
  <client-only>
    <ShopAuskunft />
  </client-only>
  <footer
    v-if="resolvedContent"
    class="pt-10"
    :style="{
      backgroundColor: resolvedContent.colors?.background,
      color: resolvedContent.colors?.text,
    }"
    data-testid="footer"
  >
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div v-if="getColumnSwitches(resolvedContent.column1).length" class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ resolvedContent.column1?.title }}
          </div>
          <ul>
            <SfListItem
              v-for="switchConfig in getColumnSwitches(resolvedContent.column1)"
              :key="switchConfig.id"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :tag="NuxtLink"
                :style="{ color: resolvedContent.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
                variant="secondary"
                :to="localePath(switchConfig.link)"
              >
                {{ switchConfig.translationKey }}
              </SfLink>
            </SfListItem>
            <!-- NEU: generierte Links aus column1.links ODER geparster description -->
            <SfListItem
              v-for="(lnk, i) in column1Links"
              :key="`c1-extra-${i}-${lnk.href}`"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <!-- Interne Links über NuxtLink, externe als <a> -->
              <component
                :is="isExternal(lnk.href) ? 'a' : NuxtLink"
                :href="isExternal(lnk.href) ? lnk.href : undefined"
                :to="!isExternal(lnk.href) ? localePath(lnk.href) : undefined"
                :target="isExternal(lnk.href) ? '_blank' : undefined"
                :rel="isExternal(lnk.href) ? 'noopener' : undefined"
                :style="{ color: resolvedContent.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
              >
                {{ lnk.text }}
              </component>
            </SfListItem>
          </ul>
          <div
            v-if="resolvedContent.column1.description"
            class="custom-html ml-4 text-sm hover:cursor-pointer"
            v-html="resolvedContent.column1.description"
          />
        </div>
        <div
          v-for="(column, i) in [resolvedContent.column2, resolvedContent.column3, resolvedContent.column4]"
          :key="i"
          class="max-w-[280px] break-words"
        >
          <div class="ml-4 text-lg font-medium leading-7">
            {{ column?.title }}
          </div>
          <div v-if="getColumnSwitches(column).length" class="text-sm">
            <ul>
              <SfListItem
                v-for="switchConfig in getColumnSwitches(column)"
                :key="switchConfig.id"
                class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
              >
                <SfLink
                  :tag="NuxtLink"
                  variant="secondary"
                  class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                  :style="{ color: resolvedContent.colors?.text }"
                  :to="localePath(switchConfig.link)"
                >
                  {{ switchConfig.translationKey }}
                </SfLink>
              </SfListItem>
            </ul>
          </div>
          <!-- NEU: strukturierte Links (oder aus description geparst) -->
          <ul v-if="columnLinks(column).length">
            <SfListItem
              v-for="(lnk, j) in columnLinks(column)"
              :key="`col-${i+2}-link-${j}-${lnk.href}`"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <component
                :is="isExternal(lnk.href) ? 'a' : NuxtLink"
                :href="isExternal(lnk.href) ? lnk.href : undefined"
                :to="!isExternal(lnk.href) ? localePath(lnk.href) : undefined"
                :target="isExternal(lnk.href) ? '_blank' : undefined"
                :rel="isExternal(lnk.href) ? 'noopener' : undefined"
                :style="{ color: resolvedContent.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
              >
                {{ lnk.text }}
              </component>
            </SfListItem>
          </ul>
          <div
            v-if="column?.description"
            class="custom-html ml-4 text-sm hover:cursor-pointer"
            v-html="column.description"
          />
        </div>
      </div>
      <div class="w-100">
        <a href="https://logo.haendlerbund.de/show.php?uuid=f8e294d2-3130-11e8-bcf5-9c5c8e4fb375-9183156061" target="_blank" >
          <img src="https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Logo/hb-logo.png" alt="Logo Händlerbund" width="150px" height="84px"  />
        </a>
      </div>
    </div>
    <div>
      <div
        v-if="resolvedContent.footnote && resolvedContent.footnote.trim() !== ''"
        class="text-sm py-10 md:py-6 px-10"
        :class="{
          'text-left': resolvedContent.footnoteAlign === 'left',
          'text-center': resolvedContent.footnoteAlign === 'center',
          'text-right': resolvedContent.footnoteAlign === 'right',
        }"
        :style="{
          color: resolvedContent.colors?.footnoteText,
          backgroundColor: resolvedContent.colors?.footnoteBackground,
        }"
        v-html="resolvedContent.footnote"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import type { FooterProps, FooterSettingsColumn } from './types';
const { t } = useI18n();
const props = defineProps<FooterProps>();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const { getFooterSettings } = useFooter();
const resolvedContent = computed(() => mapFooterData(props.content ?? getFooterSettings()));

const getColumnSwitches = (column: FooterSettingsColumn) => {
  return FOOTER_SWITCH_DEFINITIONS.filter((switchConfig) => column[switchConfig.key] === true).map((switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: t(switchConfig.shopTranslationKey),
    link: switchConfig.link,
    state: true,
  }));
};
type LinkItem = { text: string; href: string };

// helper: ist Link extern?
const isExternal = (href: string) => /^https?:\/\//i.test(href);

// helper: Description -> Links (Zeilenweise "Text | URL")
const parseLinksFromDescription = (desc?: string) => {
  if (!desc) return [];
  return desc
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [text, href] = line.split('|').map((s) => s.trim());
      if (!text || !href) return null;
      return { text, href };
    })
    .filter(Boolean) as Array<{ text: string; href: string }>;
};

// computed: finale Links für Spalte 1
const column1Links = computed(() => {
  const links = (resolvedContent.value?.column1 as any)?.links as Array<{ text: string; href: string }> | undefined;
  if (links?.length) return links;
  // Fallback: Description-Zeilen parsen (Abwärtskompatibilität)
  return parseLinksFromDescription(resolvedContent.value?.column1?.description);
});
const columnLinks = (col?: { links?: LinkItem[]; description?: string }): LinkItem[] => {
  const links = col?.links ?? [];
  if (links.length) return links;
  return parseLinksFromDescription(col?.description);
};
</script>

<style scoped>
::v-deep(.custom-html li) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
::v-deep(.custom-html li:hover) {
  text-decoration: underline;
}
</style>
