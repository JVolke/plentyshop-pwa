<template>
  <div class="w-full variation-property-text mt-1">
    <span v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold mr-2">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}:
    </span>
    <span v-if="productPropertyGetters.getPropertyValue(variationProperty)">
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';
defineProps<VariationPropertyTextProps>();
</script>
