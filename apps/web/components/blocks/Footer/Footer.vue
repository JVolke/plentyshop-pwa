<template>
  <footer
    v-if="resolvedContent"
    class="pt-10"
    :style="{
      backgroundColor: resolvedContent.colors?.background || FOOTER_COLORS.background,
      color: resolvedContent.colors?.text || FOOTER_COLORS.text,
    }"
    data-testid="footer"
  >
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ resolvedContent.column1?.title }}
          </div>
          <ul>
            <SfListItem
              v-for="({ key: subcategoryKey, link }, idx) in categories[0]?.subcategories || []"
              :key="subcategoryKey || idx"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :tag="NuxtLink"
                :style="{ color: resolvedContent.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
                variant="secondary"
                :to="localePath(link)"
              >
                {{ t(`categories.${categories[0]?.key}.subcategories.${subcategoryKey}`) }}
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
          <div v-if="column?.showContactLink" class="text-sm">
            <li
              class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :style="{ color: resolvedContent.colors?.text || '#1c1c1c' }"
                :tag="NuxtLink"
                class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                variant="secondary"
                :to="localePath('/contact')"
              >
                {{ t('categories.contact.label') }}
              </SfLink>
            </li>
          </div>
          <div
            v-if="column?.description"
            class="custom-html ml-4 text-sm hover:cursor-pointer"
            v-html="column.description"
          />
        </div>
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
          color: resolvedContent.colors?.footnoteText || FOOTER_COLORS.footnoteText,
          backgroundColor: resolvedContent.colors?.footnoteBackground || FOOTER_COLORS.footnoteBackground,
        }"
        v-html="resolvedContent.footnote"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import type { FooterProps } from './types';
import { categories } from '~/mocks';
const { t } = useI18n();
const props = defineProps<FooterProps>();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const FOOTER_COLORS = {
  background: '#cfe4ec',
  text: '#1c1c1c',
  footnoteBackground: '#161a16',
  footnoteText: '#959795',
};

const { resolvedContent } = useFooterBlock(props.content ?? null);
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
