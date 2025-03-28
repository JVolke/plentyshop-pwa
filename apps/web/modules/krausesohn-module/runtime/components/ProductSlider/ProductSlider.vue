<template>
  <p class="typography-headline-3" v-html="title" />

  <SfScrollable
    buttons-placement="floating"
    class="pb-4 scrollbar-hidden"
    :wrapper-class="wrapperClass"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="product in items"
      :key="productGetters.getId(product)"
      :product="product"
      :name="productGetters.getName(product)"
      :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
      :image-url="addModernImageExtension(productGetters.getSecondPreviewImage(product))"
      :image-alt="
        productImageGetters.getImageAlternate(productImageGetters.getFirstImage(product)) ||
        productGetters.getName(product) ||
        ''
      "
      :image-title="
        productImageGetters.getImageName(productImageGetters.getFirstImage(product)) ||
        productGetters.getName(product) ||
        ''
      "
      :image-height="productGetters.getImageHeight(product) || 600"
      :image-width="productGetters.getImageWidth(product) || 600"
      :rating-count="productGetters.getTotalReviews(product)"
      :rating="productGetters.getAverageRating(product, 'half')"
      is-from-slider
      class="max-w-48"
    />
  </SfScrollable>
</template>

<script setup lang="ts">
import { productGetters, productImageGetters } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from './types';

const { addModernImageExtension } = useModernImage();

defineProps<ProductSliderProps>();
</script>
