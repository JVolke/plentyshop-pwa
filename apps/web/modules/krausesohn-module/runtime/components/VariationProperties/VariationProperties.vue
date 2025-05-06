<template>
  <template v-for="(group, groupIndex) in variationPropertyGroups" :key="`group-${groupIndex}`">
    <tr v-for="(variationProperty, propIndex) in group.properties" :key="`group-prop-${propIndex}`" class="odd:bg-transparent">
      <template v-if="propertyHasNameOrValue(variationProperty)" >
        <ClientOnly>
          <Component
            :is="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
            v-if="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
            :variation-property="variationProperty"
          />
        </ClientOnly>
      </template>
    </tr>
  </template>
</template>

<script setup lang="ts">
import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import type { Product, VariationProperty } from '@plentymarkets/shop-api';
import type { VariationPropertiesProps, ComponentsMapper } from './types';
import VariationPropertyText from '../VariationPropertyText/VariationPropertyText.vue';
import VariationPropertyHtml from '~/components/VariationPropertyHtml/VariationPropertyHtml.vue';
import VariationPropertyDate from '~/components/VariationPropertyDate/VariationPropertyDate.vue';
import VariationPropertyFile from '~/components/VariationPropertyFile/VariationPropertyFile.vue';

const props = defineProps<VariationPropertiesProps>();
const propertyHasNameOrValue = (variationProperty: VariationProperty) => {
  return (
    productPropertyGetters.getPropertyName(variationProperty) ||
    productPropertyGetters.getPropertyValue(variationProperty)
  );
};

const variationPropertyGroups = productGetters.getPropertyGroups(props.product ?? ({} as Product));

const componentsMapper: ComponentsMapper = {
  text: VariationPropertyText,
  int: VariationPropertyText,
  float: VariationPropertyText,
  file: VariationPropertyFile,
  string: VariationPropertyText,
  html: VariationPropertyHtml,
  date: VariationPropertyDate,
  selection: VariationPropertyText,
};
</script>
