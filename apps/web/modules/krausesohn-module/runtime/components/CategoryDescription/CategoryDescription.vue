<template>
  <div v-if="description !== undefined" class="w-full no-preflight"  v-html="description" />
</template>
<script setup lang="ts">
import { categoryGetters } from '@plentymarkets/shop-api';
import type { CategoryDescriptionProps } from '~/modules/krausesohn-module/runtime/components/CategoryDescription/types';

const { category } = defineProps<CategoryDescriptionProps>();
let description: string | undefined;
if (category !== undefined)
{
  description = categoryGetters.getCategoryDetails(category)?.description;
}
else
{
  description = undefined;
}


</script>
