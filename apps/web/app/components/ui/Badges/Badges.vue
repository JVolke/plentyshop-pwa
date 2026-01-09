<template>
  <div v-if="haveBadges && useTags" data-testid="badges" class="z-[2]">
    <ul>
      <template v-if="useTags && productTags.length > 0">
        <SfListItem
          v-for="(tag, index) in productTags"
          :key="index"
          size="sm"
          class="text-xs font-medium select-none rounded-md !w-fit !px-2 opacity-75 mr-2 mb-2 cursor-pointer"
          :class="[
            tagGetters.getAgenciesTagCLass(tag),
            tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white',
          ]"
          :style="{ backgroundColor: tagGetters.getTagBackgroundColor(tag) }"
          @click="onTagClick(tag)"
        >
          {{ tagGetters.getTagName(tag) }}
        </SfListItem>
      </template>
    </ul>
    </div>
    <div v-if="haveBadges && useAvailability" data-testid="badges" class="z-[2] w-full text-center">
    <ul>
      <SfListItem
        v-if="useAvailability && productGetters.getAvailabilityName(product) && !inCategory"
        size="sm"
        class="text-xs font-medium select-none rounded-md !w-fit !cursor-text !px-2 grid mt-2"
        :class="[productGetters.getAgenciesAvailabilityCLass(product)]"
        :style="availabilityStyles"
      >
        {{ productGetters.getAvailabilityName(product) }}
      </SfListItem>
      <SfListItem
        v-if="useAvailability && productGetters.getAvailabilityName(product) && inCategory && !hasVariations && !isItem"
        size="sm"
        class="text-xs font-medium select-none rounded-md !px-2 grid mt-2"
        :class="[productGetters.getAgenciesAvailabilityCLass(product)]"
        :style="availabilityStyles"
      >
        {{ productGetters.getAvailabilityName(product) }}
      </SfListItem>
      <SfListItem
        v-if="useAvailability && productGetters.getAvailabilityName(product) && inCategory && hasVariations && !isItem"
        size="sm"
        class="text-xs font-medium select-none rounded-md !px-2 grid mt-2 text-white bg-primary-500 w-full"
        :class="[productGetters.getAgenciesAvailabilityCLass(product)]"
      >
        Zum Artikel
      </SfListItem>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SfListItem } from '@storefront-ui/vue';
import { type ProductTag, productGetters, tagGetters } from '@plentymarkets/shop-api';
import type { BadgesProps } from '~/components/ui/Badges/types';

const route = useRoute();
const isItem = computed(() => {
  return typeof route.params.itemId === 'string';
});

const localePath = useLocalePath();

const { product, useTags = true, useAvailability = false } = defineProps<BadgesProps>();

const productTags = computed(() => {
  if (!useTags) return [];
  return tagGetters.getTags(product);
});

const hasVariations = computed( () =>{
  return !(product.item.salableVariationCount === 1 || product.item.salableVariationCount === 0);

});

const availabilityStyles = computed(() => {
  if (!useAvailability) return {};

  return {
    backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
    color: productGetters.getAvailabilityTextColor(product),
  };
});

const haveBadges = computed(
  () => (useTags && productTags.value.length > 0) || (useAvailability && productGetters.getAvailabilityName(product)),
);

const onTagClick = (tag: ProductTag) => {
  navigateTo(localePath(`/tag/${tagGetters.getTagName(tag)}_${tagGetters.getTagId(tag)}`));
};
</script>
