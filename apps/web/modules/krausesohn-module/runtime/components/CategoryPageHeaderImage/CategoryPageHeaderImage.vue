<template>
  <div class="relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 px-4 mb-2">
    <img :src="'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Kategorie-Banner/' + image" class="w-full" :alt="'Kategoriebild für ' + title"/>
    <div class="absolute top-2 left-12 text-white shadow-gray-50">
      <h1 class="[text-shadow:_2px_2px_2px_rgb(0_0_0_/_75%)] font-bold lg:text-5xl ">{{ title }}</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CategoryPageImageHeaderProps } from "~/modules/krausesohn-module/runtime/components/CategoryPageHeaderImage/types";

const props = defineProps<CategoryPageImageHeaderProps>();

/** Definieren Sie ein Array (oder ein Objekt für direktere Zuordnung)
 *  Muss angepasst werden für jeden Mandanten
 */
const categoryImageGroups: Record<string, number[]> = {
  'Fasching/Karneval-Banner-Desktop.webp': [85,275],
  'T-Shirts-Banner-Desktop.webp': [648,649,650,651,652,663],
  'Angebote-Banner-Desktop.webp': [422],

  // Fügen Sie hier weitere Gruppen hinzu
};

const image = computed(() => {
  if (props.categoryId !== undefined) {
    for (const imageUrl in categoryImageGroups) {
      if (categoryImageGroups[imageUrl].includes(props.categoryId)) {
        return imageUrl;
      }
    }
  }
  return 'Deko-Banner-Desktop.webp'; // Fallback
});

const title = computed(() => props.title || ''); // Stellen Sie sicher, dass title
</script>
