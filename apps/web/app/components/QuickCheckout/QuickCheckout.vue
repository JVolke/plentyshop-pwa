<template>
  <UiModal
    v-if="isOpen"
    v-model="isOpen"
    tag="section"
    class="h-full md:h-fit m-0 p-0 lg:w-[1000px] overflow-y-auto"
    aria-label="quick-checkout-modal"
    @mousemove="endTimer()"
  >
    <header>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        <span>{{ t('quickCheckout.heading') }}</span>
      </h2>
      <div class="absolute right-2 top-2 flex items-center">
        <span v-if="hasTimer" class="mr-2 text-gray-400">{{ timer }}s</span>
        <UiButton
          :aria-label="t('common.navigation.closeDialog')"
          data-testid="quick-checkout-close"
          square
          variant="tertiary"
          @click="close"
        >
          Weiter Shoppen <SfIconClose />
        </UiButton>
      </div>
    </header>

    <div class="lg:grid lg:grid-cols-2 lg:gap-4">
      <div class="lg:border-r-2 flex flex-col items-center px-8 py-6">
        <NuxtImg
          :src="addModernImageExtension(productGetters.getMiddleImage(props.product))"
          :alt="imageAlt"
          :title="
            productImageGetters.getImageName(productImageGetters.getFirstImage(props.product))
              ? productImageGetters.getImageName(productImageGetters.getFirstImage(props.product))
              : null
          "
          width="220"
          height="220"
          loading="lazy"
          class="mb-4 max-h-[220px] object-contain"
        />

        <div class="w-full max-w-[485px]">
          <h1 class="font-bold typography-headline-4 break-word leading-tight mb-2" data-testid="product-name">
            {{ productGetters.getName(props.product) }}
          </h1>

          <div v-if="attributes.length" class="text-base mb-4">
            <div v-for="attribute in attributes" :key="attribute.id" class="leading-6">
              <span>{{ attribute.label }}:</span>
              <span class="ml-1">{{ attribute.value }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 py-3">
            <div>
              <div class="text-sm text-gray-600">{{ t('account.ordersAndReturns.orderDetails.quantity') }}:</div>
              <div class="font-semibold text-lg leading-7">{{ quantity }}</div>
            </div>

            <div class="pl-4">
              <div class="text-sm text-gray-600">Preis:</div>
              <div v-if="priceDisplay" class="font-bold text-xl leading-7">{{ priceDisplay }}*</div>
              <ProductPrice v-else :product="props.product" />
            </div>
          </div>

          <div v-if="contentDisplay || basePriceDisplay" class=" grid grid-cols-2 gap-4 py-3">
            <div v-if="contentDisplay">
              <div class="text-sm text-gray-600">Inhalt:</div>
              <div class="font-medium leading-6">{{ contentDisplay }}</div>
            </div>

            <div v-if="basePriceDisplay" class="pl-4">
              <div class="text-sm text-gray-600">Grundpreis:</div>
              <div class="font-medium leading-6">{{ basePriceDisplay }}</div>
            </div>
          </div>

          <div class="py-3 typography-text-xs flex gap-1">
            <span>{{ t('common.labels.asterisk') }}</span>
            <span v-if="showNetPrices">{{ t('product.priceExclVAT') }}</span>
            <span v-else>{{ t('product.priceInclVAT') }}</span>
            <i18n-t keypath="shipping.excludedLabel" scope="global">
              <template #shipping>
                <SfLink
                  :href="localePath(paths.shipping)"
                  target="_blank"
                  class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ t('common.labels.delivery') }}
                </SfLink>
              </template>
            </i18n-t>
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <div class="grid grid-cols-2 gap-3 items-start">
              <div class="font-semibold">Artikelnummer:</div>
              <div class="text-right">{{ props.product.variation.number }}</div>
            </div>

            <div v-if="manufacturerName" class="grid grid-cols-2 gap-3 items-start">
              <div class="font-semibold">Hersteller:</div>
              <div class="text-right">{{ manufacturerName }}</div>
            </div>
          </div>

          <VariationProperties :product="lastUpdatedProduct" class="mt-3" />
        </div>
      </div>

      <div class="py-8 px-10">
        <div class="mb-8">
          <p class="font-medium text-base">{{ t('quickCheckout.cartContains', { count: cartItemsCount }) }}</p>
          <div class="grid grid-cols-2">
            <p class="text-base">{{ t('quickCheckout.subTotal') }}:</p>
            <p v-if="showNetPrices" data-testid="subtotal" class="font-medium text-right">
              {{ format(cartGetters.getItemSumNet(cart)) }}
            </p>
            <p v-else data-testid="subtotal" class="font-medium text-right">{{ format(totals.subTotal) }}</p>
          </div>
        </div>

        <UiButton
          data-testid="quick-checkout-cart-button"
          size="lg"
          class="w-full mb-3"
          variant="secondary"
          @click="goToPage(paths.cart)"
        >
          {{ t('quickCheckout.checkYourCart') }}
        </UiButton>

        <UiButton
          data-testid="quick-checkout-checkout-button"
          size="lg"
          class="w-full mb-4 md:mb-0"
          @click="goToCheckout()"
        >
          {{ t('common.actions.goToCheckout') }}
        </UiButton>
        <!-- OrDivider v-if="isPaypalAvailable('quickCheckout')" class="my-4" / -->
        <PayPalExpressButton
          class="w-full text-center"
          location="quickCheckout"
          type="CartPreview"
          @on-approved="isOpen = false"
        />
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfLink } from '@storefront-ui/vue';
import type { QuickCheckoutProps } from './types';
import type { Product } from '@plentymarkets/shop-api';
import { manufacturerGetters, cartGetters, productGetters, productImageGetters } from '@plentymarkets/shop-api';

import ProductPrice from '~/components/ProductPrice/ProductPrice.vue';
import { paths } from '~/utils/paths';

type ProductAttribute = {
  id: string | number;
  label: string;
  value: string;
};

const props = defineProps<QuickCheckoutProps>();

const { format } = usePriceFormatter();
const { showNetPrices } = useCart();
const localePath = useLocalePath();
const { data: cart, lastUpdatedCartItem } = useCart();
const { isAvailable: isPaypalAvailable, loadConfig } = usePayPal();
const { addModernImageExtension } = useModernImage();
const { isOpen, timer, startTimer, endTimer, closeQuickCheckout, hasTimer, quantity } = useQuickCheckout();
const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const { isAuthorized } = useCustomer();

onMounted(() => {
  startTimer();
  loadConfig();
});
onUnmounted(() => endTimer());

const productData = computed(() => props.product as any);

const lastUpdatedProduct = computed(() => cartGetters.getVariation(lastUpdatedCartItem.value) || ({} as Product));

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(cart.value);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

const imageAlt = computed(() => {
  const image = props.product?.images?.all[0];
  return image ? productImageGetters.getImageAlternate(image) : '';
});

const currentVariationId =
  props?.product?.variation.id

const attributes =
  (
    productGetters.getAttributes([props.product])?.[0]?.[0] ?? []
  ).filter(
    (attribute) =>
      attribute.variationId === currentVariationId
  )

const manufacturerName = computed(() =>
  manufacturerGetters.getManufacturerExternalName(productGetters.getManufacturer(props.product)),
);

const priceDisplay = computed(() => {
  const price =
    productData.value.prices?.default?.unitPrice?.value ??
    productData.value.prices?.default?.price?.value ??
    productData.value.prices?.default?.price ??
    productData.value.price?.value ??
    productData.value.price;

  return typeof price === 'number' ? format(price) : '';
});

const contentDisplay = computed(() => {
  const content =
    productData.value.variation?.unitCombination?.content ??
    productData.value.variation?.unit?.content ??
    productData.value.unit?.content;

  const unit =
    productData.value.variation?.unitCombination?.unit?.names?.name ??
    productData.value.variation?.unit?.names?.name ??
    productData.value.unit?.names?.name;

  return content && unit ? `${content} ${unit}` : '';
});

const basePriceDisplay = computed(() => {
  const basePrice =
    productData.value.prices?.default?.basePrice ??
    productData.value.prices?.default?.basePriceFormatted ??
    productData.value.variation?.basePrice;

  if (typeof basePrice === 'string') return basePrice;
  if (typeof basePrice === 'number') return format(basePrice);

  return '';
});

const goToCheckout = () => (isAuthorized.value ? goToPage(paths.checkout) : goToPage(paths.guestLogin));

const goToPage = (path: string) => {
  closeQuickCheckout();
  navigateTo(localePath(path));
};

const close = () => {
  closeQuickCheckout();
};
</script>
