<template>
  <form
    class="md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-40"
    data-testid="purchase-card"
    @submit.prevent="handleAddToCart()"
  >
    <div class="relative">
      <div class="drift-zoom-image">
        <section class="p-4 xl:p-6">
          <div class="grid grid-cols-[2fr_1fr] mt-4">
            <h1 class="font-bold typography-headline-4 break-word" data-testid="product-name">
              {{ productGetters.getName(product) }}
            </h1>
            <div class="flex items-center justify-center">
              <WishlistButton
                :product="product"
                :quantity="quantitySelectorValue"
                :square="viewport.isLessThan('lg')"
                :class="{
                  'bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full':
                    viewport.isLessThan('lg'),
                }"
              >
                <template v-if="viewport.isGreaterOrEquals('lg')">
                  {{
                    !isWishlistItem(productGetters.getVariationId(product))
                      ? t('addToWishlist')
                      : t('removeFromWishlist')
                  }}
                </template>
              </WishlistButton>
            </div>
          </div>
          <hr>
          <div class="mt-2 variation-properties">
            <div class="grid gap-2">
              <div class="grid grid-cols-[150px_1fr] gap-2">
                <span class="font-semibold">Artikelnummer</span>
                <span >{{ product.variation.number }}</span>
              </div>
            </div>
          </div>
          <div class="inline-flex items-center mt-4 mb-2">
            <SfRating
              size="xs"
              :half-increment="true"
              :value="reviewGetters.getAverageRating(reviewAverage, 'half')"
              :max="5"
            />
            <SfCounter class="ml-1" size="xs">{{ reviewGetters.getTotalReviews(reviewAverage) }}</SfCounter>
            <UiButton
              variant="tertiary"
              class="ml-2 text-xs text-neutral-500 cursor-pointer"
              data-testid="show-reviews"
              @click="scrollToReviews"
            >
              {{ t('showAllReviews') }}
            </UiButton>
          </div>
          <div
            v-if="productGetters.getShortDescription(product).length > 0"
            class="mb-4 font-normal typography-text-sm whitespace-pre-line break-words"
            data-testid="product-description"
            v-html="productGetters.getShortDescription(product)"
          />

          <ProductAttributes :product="product" />
          <!-- BundleOrderItems v-if="product.bundleComponents" :product="product" /  Paketbestandteile -->
          <OrderProperties :product="product" />

          <div class="flex space-x-2 mt-2">
            <Price :price="priceWithProperties" :crossed-price="crossedPrice" />
            <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
              <UiTag :size="'sm'" :variant="'secondary'">{{
                  t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
                }}</UiTag>
            </div>
          </div>
          <LowestPrice :product="product" />
          <BasePrice
            v-if="productGetters.showPricePerUnit(product)"
            :base-price="basePriceSingleValue"
            :unit-content="productGetters.getUnitContent(product)"
            :unit-name="productGetters.getUnitName(product)"
          />
          <GraduatedPriceList :product="product" :count="quantitySelectorValue" />

          <UnitContentSelect
            v-if="product && productGetters.possibleUnitCombination(product).length > 1"
            :product="product"
          />

          <UiBadges class="mt-4" :product="product" :use-availability="true" />

          <div class="mt-4">
            <div class="flex flex-col md:flex-row flex-wrap gap-4">
              <UiQuantitySelector
                :min-value="productGetters.getMinimumOrderQuantity(product)"
                :value="quantitySelectorValue"
                class="min-w-[145px] flex-grow-0 flex-shrink-0 basis-0"
                @change-quantity="changeQuantity"
              />
              <SfTooltip
                show-arrow
                placement="top"
                :label="isNotValidVariation || isSalableText"
                class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
              >
                <UiButton
                  type="submit"
                  data-testid="add-to-cart"
                  size="lg"
                  class="w-full h-full"
                  :disabled="loading || !productGetters.isSalable(product)"
                >
                  <template #prefix>
                    <div v-if="!loading" class="flex row items-center">
                      <SfIconShoppingCart size="sm" />
                      {{ t('addToCart') }}
                    </div>
                    <div v-else>
                      <SfLoaderCircular size="sm" />
                    </div>
                  </template>
                </UiButton>
              </SfTooltip>
            </div>

            <div class="mt-4 typography-text-xs flex gap-1">
              <span>{{ t('asterisk') }}</span>
              <span>{{ showNetPrices ? t('itemExclVAT') : t('itemInclVAT') }}</span>
              <i18n-t keypath="excludedShipping" scope="global">
                <template #shipping>
                  <SfLink
                    :href="localePath(paths.shipping)"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ t('delivery') }}
                  </SfLink>
                </template>
              </i18n-t>
            </div>
            <client-only>
              <ShippingTimer v-if="productGetters.getAvailabilityId(product) === 1 && !isFirework && !isT1"/>
            </client-only>
          </div>
          <hr class="mt-2"/>
          <div class="mt-2 variation-properties">
            <div class="grid gap-2">
              <VariationProperties :product="product" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { productGetters, reviewGetters, productBundleGetters, manufacturerGetters } from '@plentymarkets/shop-api';
import { SfCounter, SfRating, SfIconShoppingCart, SfLoaderCircular, SfTooltip, SfLink } from '@storefront-ui/vue';
import type { PriceCardPadding, PurchaseCardProps } from '~/components/ui/PurchaseCard/types';
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';
import { paths } from '~/utils/paths';

const props = withDefaults(defineProps<PurchaseCardProps>(), {
  configuration: () => ({
    fields: {
      itemName: true,
      price: true,
      tags: true,
      availability: true,
      starRating: true,
      orderProperties: true,
      variationProperties: true,
      previewText: true,
      attributes: true,
      itemBundle: false,
      graduatedPrices: true,
      addToWishlist: true,
      quantityAndAddToCart: true,
      itemText: false,
      technicalData: false,
    },
    fieldsOrder: [
      'itemName',
      'price',
      'tags',
      'availability',
      'starRating',
      'variationProperties',
      'orderProperties',
      'previewText',
      'attributes',
      'itemBundle',
      'graduatedPrices',
      'addToWishlist',
      'quantityAndAddToCart',
      'itemText',
      'technicalData',
    ],
    fieldsDisabled: ['quantityAndAddToCart', 'price', 'itemBundle', 'attributes'],
    wishlistSize: 'small',

    dropShadow: true,
    borders: true,
    borderColor: '#EFF4F1',
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: 0,
    },
  }),
});

const { currentProduct } = useProducts();

const { data: productReviews } = useProductReviews(Number(productGetters.getItemId(currentProduct.value)));
const reviewAverage = computed(() => reviewGetters.getReviewCounts(productReviews.value));

const { getSetting } = useSiteSettings('dontSplitItemBundle');
const showBundleComponents = computed(() => {
  return getSetting() !== '1';
});

const { showNetPrices } = useCart();
const viewport = useViewport();
const { getCombination } = useProductAttributes();
const { getPropertiesForCart, getPropertiesPrice } = useProductOrderProperties();
const { validateAllFields, invalidFields, resetInvalidFields } = useValidatorAggregator('properties');
const {
  validateAllFields: validateAllFieldsAttributes,
  invalidFields: invalidAttributeFields,
  resetInvalidFields: resetAttributeFields,
} = useValidatorAggregator('attributes');
const { clear, send } = useNotification();
const { addToCart, loading } = useCart();
const { t } = useI18n();
const quantitySelectorValue = ref(productGetters.getMinimumOrderQuantity(props?.product));
const { isWishlistItem } = useWishlist();
const { openQuickCheckout } = useQuickCheckout();
const { crossedPrice } = useProductPrice(props?.product);
const { reviewArea } = useProductReviews(Number(productGetters.getId(props?.product)));
const localePath = useLocalePath();

const inlineStyle = computed(() => {
  const layout = props?.configuration?.layout || ({} as PriceCardPadding);

  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
    borderColor: props?.configuration?.borderColor || 'transparent',
  };
});

onMounted(() => {
  resetInvalidFields();
  resetAttributeFields();
});

onBeforeRouteLeave(() => {
  if (invalidFields.value.length > 0 || invalidAttributeFields.value.length > 0) clear();
  resetInvalidFields();
  resetAttributeFields();
});

const priceWithProperties = computed(
  () =>
    (productGetters.getSpecialOffer(props?.product) ||
      productGetters.getGraduatedPriceByQuantity(props?.product, quantitySelectorValue.value)?.unitPrice.value ||
      productGetters.getPrice(props?.product) ||
      0) + getPropertiesPrice(props?.product),
);


const getFireworkProperty = productGetters.getPropertyById(4, props?.product);
const isFirework = computed(()=>{
  if (getFireworkProperty)
  {
    return getFireworkProperty.values.selectionId === 5;
  }
  return false;
});
const isT1 = computed(()=>{
  if (getFireworkProperty)
  {
    return getFireworkProperty.values.selectionId === 12;
  }
  return false;
});

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props?.product, quantitySelectorValue.value)?.basePrice ??
    productGetters.getDefaultBasePrice(props?.product),
);

const handleValidationErrors = (): boolean => {
  send({
    message: [
      t('errorMessages.missingOrWrongProperties'),
      '',
      ...invalidAttributeFields.value.map((field) => field.name),
      ...invalidFields.value.map((field) => field.name),
      '',
      t('errorMessages.pleaseFillOutAllFields'),
    ],
    type: 'negative',
  });

  return false;
};

const handleAddToCart = async (quickCheckout = true) => {
  await validateAllFieldsAttributes();
  await validateAllFields();

  if (invalidFields.value.length > 0 || invalidAttributeFields.value.length > 0) {
    return handleValidationErrors();
  }

  if (!getCombination()) {
    send({ message: t('productAttributes.notValidVariation'), type: 'negative' });
    return false;
  }

  const addedToCart = await addToCart({
    productId: Number(productGetters.getId(props?.product)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: getPropertiesForCart(),
  });

  if (addedToCart) {
    quickCheckout
      ? openQuickCheckout(props?.product, quantitySelectorValue.value)
      : send({ message: t('addedToCart'), type: 'positive' });

    if (getSetting() === '0') {
      send({ message: t('error.notificationsItemBundleSplitted'), type: 'warning' });
    }
  }

  return addedToCart;
};

const paypalHandleAddToCart = async (callback: PayPalAddToCartCallback) => {
  const added = await handleAddToCart(false);

  callback(added);
};

const changeQuantity = (quantity: string) => {
  quantitySelectorValue.value = Number(quantity);
};

const isReviewsAccordionOpen = () => {
  const customerReviewsAccordionDetailsElement = document.querySelector('#customerReviewsAccordion')
    ?.firstChild as HTMLDetailsElement;

  return customerReviewsAccordionDetailsElement.open;
};

const openReviewsAccordion = () => {
  const customerReviewsClickElement = document.querySelector('#customerReviewsClick') as HTMLElement;
  customerReviewsClickElement?.click();
};

const isSalableText = computed(() => (productGetters.isSalable(props?.product) ? '' : t('itemNotAvailable')));
const isNotValidVariation = computed(() => (getCombination() ? '' : t('productAttributes.notValidVariation')));
const showPayPalButtons = computed(() => Boolean(getCombination()) && productGetters.isSalable(props?.product));

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  if (reviewArea.value) {
    reviewArea.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
