<template>
  <div class="border border-neutral-200 rounded-md hover:shadow-lg flex flex-col" data-testid="product-card">
    <div class="relative overflow-hidden">
      <UiBadges
        :class="['absolute', isFromWishlist ? 'mx-2' : 'm-2']"
        :product="product"
        :use-availability="isFromWishlist"
      />

      <SfLink
        :tag="NuxtLink"
        rel="preload"
        :to="localePath(`${path}/${productSlug}`)"
        :class="{ 'size-48': isFromSlider }"
        as="image"
        class="flex items-center justify-center"
      >
        <NuxtImg
          ref="img"
          :src="imageUrl"
          :alt="imageAlt"
          :loading="lazy && !priority ? 'lazy' : 'eager'"
          :fetchpriority="priority ? 'high' : 'auto'"
          :preload="priority || false"
          class="object-contain rounded-md aspect-square w-full"
          data-testid="image-slot"
          :width="imageWidth"
          :height="imageHeight"
        />
        <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" />
      </SfLink>

      <slot name="wishlistButton">
        <WishlistButton
          square
          class="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
          :product="product"
        />
      </slot>
    </div>
    <div class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col flex-auto">
      <SfLink :tag="NuxtLink" :to="localePath(`${path}/${productSlug}`)" class="no-underline" variant="secondary">
        {{ name }}
      </SfLink>
      <div class="flex items-center pt-1 gap-1">
        <SfRating size="xs" :value="rating ?? 0" :max="5" />
        <SfCounter size="xs">{{ ratingCount }}</SfCounter>
      </div>

      <p class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify">
        {{ description }}
      </p>
      <LowestPrice :product="product" />
      <div v-if="showBasePrice" class="mb-2">
        <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
      </div>
      <div class="flex items-center mt-auto">
        <span class="block pb-2 font-bold typography-text-sm" data-testid="product-card-vertical-price">
          <span v-if="!productGetters.canBeAddedToCartFromCategoryPage(product)" class="mr-1">
            {{ t('account.ordersAndReturns.orderDetails.priceFrom') }}
          </span>
          <span>{{ n(cheapestPrice ?? mainPrice, 'currency') }}</span>
          <span v-if="showNetPrices">{{ t('asterisk') }} </span>
        </span>
        <span
          v-if="oldPrice && oldPrice !== mainPrice"
          class="typography-text-sm text-neutral-500 line-through ml-3 pb-2"
        >
          {{ n(oldPrice, 'currency') }}
        </span>
      </div>
      <SfButton
        v-if="productGetters.canBeAddedToCartFromCategoryPage(product) || isFromWishlist"
        size="sm"
        class="min-w-[80px] w-fit"
        data-testid="add-to-basket-short"
        @click="addWithLoader(Number(productGetters.getId(product)))"
        :disabled="loading"
      >
        <template #prefix v-if="!loading">
          <SfIconShoppingCart size="sm" />
        </template>
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ t('addToCartShort') }}
        </span>
      </SfButton>
      <SfButton v-else type="button" :tag="NuxtLink" :to="localePath(`${path}/${productSlug}`)" size="sm" class="w-fit">
        <span>{{ t('showArticle') }}</span>
        <template #prefix>
          <SfIconChevronRight size="sm" />
        </template>
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-sdk';
import {
  SfLink,
  SfButton,
  SfIconShoppingCart,
  SfLoaderCircular,
  SfIconChevronRight,
  SfRating,
  SfCounter,
} from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';

const localePath = useLocalePath();
const { t, n } = useI18n();
const { product } = withDefaults(defineProps<ProductCardProps>(), {
  lazy: true,
  imageAlt: '',
  isFromWishlist: false,
  isFromSlider: false,
});

const { data: categoryTree } = useCategoryTree();
const { openQuickCheckout } = useQuickCheckout();

const { addToCart } = useCart();
const { send } = useNotification();
const loading = ref(false);
const imageLoaded = ref(false);
const img = ref();
const emit = defineEmits(['load']);
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

onMounted(() => {
  const imgElement = (img.value?.$el as HTMLImageElement) || null;

  if (imgElement) {
    if (!imageLoaded.value) {
      if (imgElement.complete) imageLoaded.value = true;
      imgElement.addEventListener('load', () => (imageLoaded.value = true));
    }

    nextTick(() => {
      if (!imgElement.complete) emit('load');
    });
  }
});

const addWithLoader = async (productId: number) => {
  loading.value = true;

  try {
    await addToCart({
      productId: productId,
      quantity: 1,
    });

    openQuickCheckout(product, 1);
    send({ message: t('addedToCart'), type: 'positive' });
  } finally {
    loading.value = false;
  }
};

const mainPrice = computed(() => {
  const price = productGetters.getPrice(product);
  if (!price) return 0;

  if (price.special) return price.special;
  if (price.regular) return price.regular;

  return 0;
});

const cheapestPrice = productGetters.getCheapestGraduatedPrice(product);
const oldPrice = productGetters.getRegularPrice(product);
const path = computed(() => productGetters.getCategoryUrlPath(product, categoryTree.value));
const productSlug = computed(() => productGetters.getSlug(product) + `_${productGetters.getItemId(product)}`);
const NuxtLink = resolveComponent('NuxtLink');
</script>
