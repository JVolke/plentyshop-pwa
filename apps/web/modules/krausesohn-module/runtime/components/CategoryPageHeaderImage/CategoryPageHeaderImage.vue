<template>
  <div class="relative mx-auto px-0.5 mb-2">
    <img :src="'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Kategorie-Banner/' + image" class="w-full" :alt="'Kategoriebild für ' + title"/>
    <div class="absolute top-2 left-12 text-white shadow-gray-50">
      <h1 class="[text-shadow:_2px_2px_2px_rgb(0_0_0_/_75%)] font-bold lg:text-5xl ">{{ title }}</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CategoryPageImageHeaderProps } from '#krause/components/CategoryPageHeaderImage/types'

const props = defineProps<CategoryPageImageHeaderProps>()

/** Definieren Sie ein Array (oder ein Objekt für direktere Zuordnung)
 *  Muss angepasst werden für jeden Mandanten
 */
const categoryImageGroups: Record<string, number[]> = {
  'Fasching/Karneval-Banner-Desktop.webp': [85,275,278,687,304,309,310,561,678],
  'Fasching/Laender-Banner-Desktop.webp': [276],
  'Fasching/Filme-Banner-Desktop.webp': [676,285],
  'Fasching/Antike-Banner-Desktop.webp': [277],
  'Fasching/Beachparty-Banner-Desktop.webp': [474],
  'Fasching/Berufe-Banner-Desktop.webp': [279],
  'Fasching/Cowboy-Banner-Desktop.webp': [313],
  'Fasching/Steampunk-Banner-Desktop.webp': [281],
  'Fasching/JGA-Banner-Desktop.webp': [283],
  'Fasching/Kirche-Banner-Desktop.webp': [284],
  'Fasching/Lustige-Banner-Desktop.webp': [280],
  'Fasching/Maenerballett-Banner-Desktop.webp': [286],
  'Fasching/Maerchen-Banner-Desktop.webp': [287],
  'Fasching/Mittelalter-Banner-Desktop.webp': [288],
  'Fasching/Oktoberfest-Banner-Desktop.webp': [289],
  'Fasching/Opposuits-Banner-Desktop.webp': [290],
  'Fasching/Piraten-Banner-Desktop.webp': [291],
  'Fasching/Promotion-Banner-Desktop.webp': [475],
  'Fasching/Sexy-Banner-Desktop.webp': [263],
  'Fasching/Sport-Banner-Desktop.webp': [248],
  'Fasching/Steinzeit-Banner-Desktop.webp': [293],
  'Fasching/Tiere-Banner-Desktop.webp': [294],
  'Fasching/Ostern-s.webp': [267],
  'Weihnachten-Banner-Desktop.webp': [299,653],
  'Fasching/20er-Banner-Desktop.webp': [295],
  'Fasching/60er-Banner-Desktop.webp': [296],
  'Fasching/70er-Banner-Desktop.webp': [297],
  'Fasching/90er-Banner-Desktop.webp': [298],
  'Neuheiten-Banner-Desktop.webp': [169],
  'Fasching/Damen-Banner-Desktop.webp': [170],
  'Fasching/Herren-Banner-Desktop.webp': [198],
  'Fasching/Kinder-Banner-Desktop.webp': [226,677],
  'Fasching/Paar-Kostueme-Banner-Desktop.webp': [243,680],
  'Fasching/XXL-Banner-Desktop.webp': [560],
  'Fasching/Schminke-Banner-Desktop.webp': [104],
  'Fasching/Peruecken-Banner-Desktop.webp': [109],
  'Fasching/Handschuhe-Banner-Desktop.webp': [307],
  'Fasching/Huete-Banner-Desktop.webp': [145],
  'Partysets-Banner-Desktop.webp': [654],
  'Banner-Personalisiertes.webp': [696],
  'Spiele-Banner-Desktop.webp': [639,664,665,672,662,640,661],
  'T-Shirts-Banner-Desktop.webp': [648,649,650,651,652,663],
  'Fackeln-Banner-Desktop.webp': [65,66,274,314,251,675,686],
  'Angebote-Banner-Desktop.webp': [422,165],
  'Fasching/Halloween-Banner-Desktop.webp': [282]
  // Fügen Sie hier weitere Gruppen hinzu
};

// Hilfsfunktion zur klaren Typ-Narrowing
function findImageForCategory(id: number): string | undefined {
  for (const [imageUrl, ids] of Object.entries(categoryImageGroups)) {
    // ids ist hier number[] (nicht undefined)
    if (ids.includes(id)) return imageUrl
  }
  return undefined
}

// computed mit explizitem Rückgabetyp + Nullish-Checks
const image = computed<string>(() => {
  const id = props.categoryId
  const resolved = id != null ? findImageForCategory(id) : undefined
  return resolved ?? 'Deko-Banner-Desktop.webp'
})

const title = computed<string>(() => props.title ?? '')
</script>
