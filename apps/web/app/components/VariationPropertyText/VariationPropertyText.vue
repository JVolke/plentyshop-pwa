<template>
  <span v-if="productPropertyGetters.getPropertyName(variationProperty) && productPropertyGetters.getPropertyId(variationProperty) !== 2 " class="font-semibold mr-2">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}:
  </span>
  <template v-if="productPropertyGetters.getPropertyValue(variationProperty)">
    <img
      v-if="productPropertyGetters.getPropertyId(variationProperty) === 115"
      :src="imageSrc"
      :alt="productPropertyGetters.getPropertyValue(variationProperty)"
      width="80"
      height="80"
      class="float-right"
    />
    <a
      v-else-if="productPropertyGetters.getPropertyId(variationProperty) === 9"
      class="underline"
      href="/1/definition-feuerwerkskategorien"
      title="Definition der Feuerwerkskategorien"
      target="_blank"
    >
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </a>
    <span
      v-else-if="productPropertyGetters.getPropertyId(variationProperty) === 2"
      class="hidden" />
    <span v-else-if="productPropertyGetters.getPropertyId(variationProperty) !== 2" :class="isWarn">
        {{ productPropertyGetters.getPropertyValue(variationProperty) }}
      </span>
  </template>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';

const props = defineProps<VariationPropertyTextProps>();
const variationProperty = props.variationProperty;

const isWarn = computed(() => {
  if (productPropertyGetters.getPropertyName(variationProperty) == "Warnhinweise")
  {
    return "text-right"
  }
  return "";
});
const selectionImageMap: Record<number, string> = {
  170: '/piktos/acid_red_aetzend_korrosiv.gif',
  171: '/piktos/rondflam.gif',
  172: '/piktos/flamme.gif',
  173: '/piktos/silhouete_ernste_gesundheitsgefahr.gif',
  174: '/piktos/explos.gif',
  175: '/piktos/bottle_gase_unter_druck.png',
  177: '/piktos/skull_giftig.gif',
  178: '/piktos/Aquatic-pollut-red.gif',
}

const selectionId = variationProperty.values?.selectionId;
const imageSrc = selectionId
  ? selectionImageMap[selectionId]
  : '/images/default.png'; // Fallback-Bild

</script>
