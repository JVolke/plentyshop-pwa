<template>
  <div v-for="(group, groupIndex) in variationPropertyGroups" :key="`group-${groupIndex}`" class="mb-2">
    <template v-for="(variationProperty, propIndex) in group.properties" :key="`group-prop-${propIndex}`">
      <div v-if="propertyHasNameOrValue(variationProperty)" class="grid grid-cols-[150px_1fr] gap-2">
        <Component
          :is="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)]"
          v-if="componentsMapper[productPropertyGetters.getPropertyCast(variationProperty)] && !excludeIds.includes(productPropertyGetters.getPropertyId(variationProperty))"
          :variation-property="variationProperty"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import type { Product, VariationProperty } from '@plentymarkets/shop-api';
import type { VariationPropertiesProps, ComponentsMapper } from './types';
import VariationPropertyText from '../VariationPropertyText/VariationPropertyText.vue';
import VariationPropertyHtml from '~/components/VariationPropertyHtml/VariationPropertyHtml.vue';
import VariationPropertyDate from '~/components/VariationPropertyDate/VariationPropertyDate.vue';
import VariationPropertyFile from '~/components/VariationPropertyFile/VariationPropertyFile.vue';

const excludeIds = [50,51,13,14,15]; // Eigenschaften, die nicht angezeigt werden sollen
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
