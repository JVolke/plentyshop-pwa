<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('common.actions.back')"
    :back-label-mobile="t('common.actions.back')"
    :heading="t('common.labels.checkout')"
  >
    <template v-if="stepCheckoutEnabled">
      <div v-if="cart" class="@lg:grid @lg:grid-cols-12 @lg:gap-x-6">
        <div class="col-span-6 @xl:col-span-7 mb-10 @lg:mb-0">
          <nav class="mb-6 border border-neutral-200 rounded-md bg-white" aria-label="Checkout steps">
            <ol class="grid grid-cols-1 @md:grid-cols-3">
              <li
                v-for="step in steps"
                :key="step.id"
                class="border-b last:border-b-0 @md:border-b-0 @md:border-r @md:last:border-r-0"
              >
                <button
                  type="button"
                  class="w-full flex items-center gap-3 px-4 py-3 text-left"
                  :class="stepButtonClass(step.id)"
                  :disabled="!canOpenStep(step.id)"
                  @click="goToStep(step.id)"
                >
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                    :class="stepIndicatorClass(step.id)"
                  >
                    {{ step.id }}
                  </span>
                  <span class="flex flex-col">
                    <span class="font-bold">{{ step.label }}</span>
                    <span class="text-xs text-neutral-500">{{ step.description }}</span>
                  </span>
                </button>
              </li>
            </ol>
          </nav>

          <section v-show="currentStep === 1" class="border border-neutral-200 rounded-md bg-white">
            <div class="px-4 pt-4">
              <h2 class="text-neutral-900 text-lg font-bold">{{ t('krausesohn.checkout.addressStep') }}</h2>
            </div>
            <UiDivider id="top-contact-information-divider" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <ContactInformation id="contact-information" />
            <UiDivider id="top-shipping-divider" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <AddressContainer id="shipping-address" :key="0" :type="AddressType.Shipping" />
            <UiDivider id="top-billing-divider" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <div v-if="showBillingAddressSection">
              <AddressContainer id="billing-address" :key="1" :type="AddressType.Billing" />
              <UiDivider id="bottom-billing-divider" class-name="w-screen @md:w-auto -mx-4 @md:mx-0" />
            </div>
            <div v-if="addressStepComplete" class="flex justify-end p-4">
              <UiButton type="button" :disabled="!checkoutReady" @click="continueFromAddress">
                {{ t('krausesohn.checkout.continue') }}
              </UiButton>
            </div>
          </section>

          <section
            v-show="currentStep === 2"
            class="relative border border-neutral-200 rounded-md bg-white"
            :class="{ 'pointer-events-none opacity-50': disableShippingPayment }"
          >
            <div class="px-4 pt-4">
              <h2 class="text-neutral-900 text-lg font-bold">{{ t('krausesohn.checkout.shippingPaymentStep') }}</h2>
            </div>
            <ShippingMethod
              :disabled="disableShippingPayment"
              :loading="!checkoutReady"
              @update:shipping-method="handleShippingMethodUpdate"
            />
            <SfLoaderCircular
              v-if="disableShippingPayment"
              class="absolute mt-5 right-0 left-0 m-auto z-loader"
              size="2xl"
            />
            <UiDivider class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <PreferredDeliveryPackstationFinder v-if="countryHasDelivery" />
            <PreferredDelivery v-if="countryHasDelivery" />
            <UiDivider v-if="preferredDeliveryAvailable" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <CheckoutPayment :disabled="disableShippingPayment" @update:active-payment="handlePaymentMethodUpdate" />
            <div class="flex flex-col-reverse gap-3 p-4 @sm:flex-row @sm:justify-between">
              <UiButton type="button" variant="secondary" @click="goToStep(1)">
                {{ t('common.actions.back') }}
              </UiButton>
              <UiButton
                type="button"
                :disabled="!checkoutReady || disableShippingPayment"
                @click="continueFromShippingPayment"
              >
                {{ t('krausesohn.checkout.continue') }}
              </UiButton>
            </div>
          </section>

          <section v-show="currentStep === 3" class="border border-neutral-200 rounded-md bg-white">
            <div class="px-4 pt-4">
              <h2 class="text-neutral-900 text-lg font-bold">{{ t('krausesohn.checkout.reviewStep') }}</h2>
            </div>
            <div class="px-4 py-6">
              <div class="grid gap-4 mb-6 @xl:grid-cols-2">
                <section class="border border-neutral-200 rounded-md p-4">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="font-bold">{{ t('shipping.heading') }}</h3>
                    <UiButton type="button" variant="secondary" size="sm" @click="goToStep(1)">
                      {{ t('common.actions.edit') }}
                    </UiButton>
                  </div>
                  <AddressDisplay v-if="shippingAddress" :address="shippingAddress" />
                </section>

                <section class="border border-neutral-200 rounded-md p-4">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="font-bold">{{ t('billing.heading') }}</h3>
                    <UiButton type="button" variant="secondary" size="sm" @click="goToStep(1)">
                      {{ t('common.actions.edit') }}
                    </UiButton>
                  </div>
                  <AddressDisplay v-if="billingAddress" :address="billingAddress" />
                </section>

                <section class="border border-neutral-200 rounded-md p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="font-bold mb-2">{{ t('shipping.method.heading') }}</h3>
                      <p class="text-sm text-neutral-700">{{ selectedShippingMethodName }}</p>
                      <p v-if="selectedShippingAmountLabel" class="text-sm text-neutral-500">
                        {{ selectedShippingAmountLabel }}
                      </p>
                    </div>
                    <UiButton type="button" variant="secondary" size="sm" @click="goToStep(2)">
                      {{ t('common.actions.edit') }}
                    </UiButton>
                  </div>
                </section>

                <section class="border border-neutral-200 rounded-md p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="font-bold mb-2">{{ t('checkout.payment.heading') }}</h3>
                      <p class="text-sm text-neutral-700">{{ selectedPaymentName }}</p>
                    </div>
                    <UiButton type="button" variant="secondary" size="sm" @click="goToStep(2)">
                      {{ t('common.actions.edit') }}
                    </UiButton>
                  </div>
                </section>
              </div>

              <div class="mb-6 @lg:hidden">
                <h3 class="font-bold mb-3">{{ t('krausesohn.checkout.products') }}</h3>
                <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
                  <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
                </div>
              </div>
              <Coupon />
              <CustomerWish />
            </div>
            <div class="flex flex-col-reverse gap-3 p-4 @sm:flex-row @sm:justify-between">
              <UiButton type="button" variant="secondary" @click="goToStep(2)">
                {{ t('common.actions.back') }}
              </UiButton>
            </div>
          </section>
        </div>

        <div class="col-span-6 @xl:col-span-5">
          <div
            class="relative @lg:sticky @lg:top-20 @lg:max-h-[calc(100vh-6rem)] @lg:flex @lg:flex-col"
            :class="{ 'pointer-events-none opacity-50': cartLoading }"
          >
            <SfLoaderCircular
              v-if="cartLoading"
              class="absolute top-[130px] right-0 left-0 m-auto z-loader"
              size="2xl"
            />
            <div
              class="hidden @lg:flex @lg:min-h-0 @lg:flex-1 flex-col mb-4 border border-neutral-200 rounded-md bg-white"
            >
              <h2 class="px-4 py-3 font-bold">
                {{ t('krausesohn.checkout.products') }}
                <span v-if="cartItemsCount > 1" class="font-normal text-neutral-500">({{ cartItemsCount }})</span>
              </h2>
              <div class="@lg:min-h-0 @lg:overflow-y-auto">
                <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
                  <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
                </div>
              </div>
            </div>
            <OrderSummary v-if="cart" :cart="cart" class="@lg:shrink-0">
              <div v-show="currentStep === 3">
                <CheckoutGeneralTerms />
                <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
                <ClientOnly>
                  <div @click.capture="trackPaymentInteraction">
                    <PaymentButtons />
                  </div>
                </ClientOnly>
                <ModuleComponentRendering area="checkout.afterBuyButton" />
              </div>
              <UiButton
                v-show="currentStep === 2"
                type="button"
                class="w-full"
                :disabled="nextStepDisabled"
                @click="continueFromCurrentStep"
              >
                {{ t('krausesohn.checkout.continue') }}
              </UiButton>
            </OrderSummary>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="cart" class="@lg:grid @lg:grid-cols-12 @lg:gap-x-6">
        <div class="col-span-6 @xl:col-span-7 mb-10 @lg:mb-0">
          <UiDivider id="top-contact-information-divider" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
          <ContactInformation id="contact-information" />
          <UiDivider id="top-shipping-divider" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
          <AddressContainer id="shipping-address" :key="0" :type="AddressType.Shipping" />
          <UiDivider id="top-billing-divider" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
          <div v-if="showBillingAddressSection">
            <AddressContainer id="billing-address" :key="1" :type="AddressType.Billing" />
            <UiDivider id="bottom-billing-divider" class-name="w-screen @md:w-auto -mx-4 @md:mx-0" />
          </div>
          <div class="relative" :class="{ 'pointer-events-none opacity-50': disableShippingPayment }">
            <ShippingMethod
              :disabled="disableShippingPayment"
              :loading="!checkoutReady"
              @update:shipping-method="handleShippingMethodUpdate"
            />
            <SfLoaderCircular
              v-if="disableShippingPayment"
              class="absolute mt-5 right-0 left-0 m-auto z-loader"
              size="2xl"
            />
            <UiDivider class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <PreferredDeliveryPackstationFinder v-if="countryHasDelivery" />
            <PreferredDelivery v-if="countryHasDelivery" />
            <UiDivider v-if="preferredDeliveryAvailable" class="w-screen @md:w-auto -mx-4 @md:mx-0" />
            <CheckoutPayment :disabled="disableShippingPayment" @update:active-payment="handlePaymentMethodUpdate" />
          </div>
          <UiDivider class="w-screen @md:w-auto -mx-4 @md:mx-0 mb-10" />
        </div>
        <div class="col-span-6 @xl:col-span-5">
          <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
            <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
          </div>
          <div class="relative @md:sticky @md:top-20 h-fit" :class="{ 'pointer-events-none opacity-50': cartLoading }">
            <SfLoaderCircular
              v-if="cartLoading"
              class="absolute top-[130px] right-0 left-0 m-auto z-loader"
              size="2xl"
            />
            <Coupon />
            <CustomerWish />
            <OrderSummary v-if="cart" :cart="cart" class="mt-4">
              <CheckoutGeneralTerms />
              <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
              <ClientOnly>
                <div @click.capture="trackPaymentInteraction">
                  <PaymentButtons />
                </div>
              </ClientOnly>
              <ModuleComponentRendering area="checkout.afterBuyButton" />
            </OrderSummary>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { ApiError } from '@plentymarkets/shop-api';
import { AddressType, cartGetters, shippingProviderGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import { useMatomo } from '#matomo/composables/useMatomo';

type CheckoutStep = 1 | 2 | 3;

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: 'simplified-header-and-footer',
  pageType: 'static',
  middleware: ['reject-empty-checkout'],
});

const { send } = useNotification();
const localePath = useLocalePath();
const route = useRoute();
const { emit } = usePlentyEvent();
const {
  countryHasDelivery,
  hasCheckoutAddress,
  checkoutAddress: shippingAddress,
} = useCheckoutAddress(AddressType.Shipping);
const { checkoutAddress: billingAddress } = useCheckoutAddress(AddressType.Billing);
const currentStep = ref<CheckoutStep>(1);
const checkoutReady = ref(false);
const addressFormWasOpen = ref(false);
const { format } = usePriceFormatter();
const { getSetting: getStepCheckoutSetting } = useSiteSettings('enableKrauseStepCheckout');
const {
  cart,
  cartIsEmpty,
  cartLoading,
  persistShippingAddress,
  persistBillingAddress,
  setBillingSkeleton,
  setShippingSkeleton,
  showBillingAddressSection,
  anyAddressFormIsOpen,
  hasShippingAddress,
  hasBillingAddress,
  backToFormEditing,
  scrollToShippingAddress,
  scrollToBillingAddress,
} = useCheckout();
const { preferredDeliveryAvailable } = usePreferredDelivery();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { fetchPaymentMethods } = usePaymentMethods();
const { getScript } = usePayPal();
const { selectedMethod } = useCartShippingMethods();
const {
  paymentLoading,
  shippingLoading,
  paymentMethods,
  selectedPaymentId,
  handleShippingMethodUpdate,
  handlePaymentMethodUpdate,
} = useCheckoutPagePaymentAndShipping();

const steps = [
  {
    id: 1,
    label: t('krausesohn.checkout.addressStep'),
    description: t('krausesohn.checkout.addressStepDescription'),
  },
  {
    id: 2,
    label: t('krausesohn.checkout.shippingPaymentStep'),
    description: t('krausesohn.checkout.shippingPaymentStepDescription'),
  },
  {
    id: 3,
    label: t('krausesohn.checkout.reviewStep'),
    description: t('krausesohn.checkout.reviewStepDescription'),
  },
] as const;

useHead({
  title: 'Kasse - Bestellung abschliessen',
});

emit('frontend:beginCheckout', cart.value);
if (import.meta.client) useLogEvent().logOpeningCheckout();

const stepCheckoutEnabled = computed(() => String(getStepCheckoutSetting()) !== 'false');
const shouldStartInReviewStep = computed(
  () => route.path.includes(paths.readonlyCheckout) || Boolean(route.query.orderId),
);

const checkPayPalPaymentsEligible = async () => {
  if (import.meta.client) {
    const { data: cart } = useCart();
    const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));

    await getScript(currency.value, true);
  }
};

await callOnce(async () => {
  await fetchPaymentMethods();
});

onNuxtReady(async () => {
  await useFetchAddressesData()
    .fetch()
    .then(() => persistShippingAddress())
    .then(() => persistBillingAddress())
    .catch((error: ApiError) => useHandleError(error))
    .finally(() => {
      setBillingSkeleton(false);
      setShippingSkeleton(false);
    });

  await Promise.all([
    checkPayPalPaymentsEligible(),
    ...(hasCheckoutAddress.value ? [useCartShippingMethods().getShippingMethods()] : []),
  ]);

  checkoutReady.value = true;
});

const disableShippingPayment = computed(() => shippingLoading.value || paymentLoading.value);
const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
const { trackCheckoutStep, trackCheckoutBarrier } = useMatomo();
const trackedCheckoutSteps = new Set<string>();

const trackCheckoutStepOnce = (step: string) => {
  if (trackedCheckoutSteps.has(step)) return;
  trackedCheckoutSteps.add(step);
  trackCheckoutStep(step);
};

const addressStepComplete = computed(
  () => hasShippingAddress.value && hasBillingAddress.value && !anyAddressFormIsOpen.value,
);
const shippingPaymentStepComplete = computed(
  () => Boolean(selectedMethod.value) && Boolean(selectedPaymentId.value) && !disableShippingPayment.value,
);
const shippingAndPaymentReady = computed(() => addressStepComplete.value && shippingPaymentStepComplete.value);

watch(addressStepComplete, (ready) => ready && trackCheckoutStepOnce('02 Address ready'), { immediate: true });
watch(shippingAndPaymentReady, (ready) => ready && trackCheckoutStepOnce('03 Shipping and payment ready'), {
  immediate: true,
});
const selectedPaymentName = computed(
  () => paymentMethods.value?.list?.find((payment) => payment.id === selectedPaymentId.value)?.name || '',
);
const selectedShippingMethodName = computed(() =>
  selectedMethod.value ? shippingProviderGetters.getShippingMethodName(selectedMethod.value) : '',
);
const selectedShippingAmountLabel = computed(() => {
  if (!selectedMethod.value) return '';

  const amount = shippingProviderGetters.getShippingAmount(selectedMethod.value);

  return amount === '0' ? t('shipping.method.free') : format(Number(amount));
});
const cartItemsCount = computed(() => cart.value?.items?.reduce((count, { quantity }) => count + quantity, 0) ?? 0);
const nextStepDisabled = computed(() => {
  if (currentStep.value === 1) return !addressStepComplete.value || !checkoutReady.value;
  if (currentStep.value === 2) return !shippingPaymentStepComplete.value || !checkoutReady.value;
  return false;
});

const canOpenStep = (step: CheckoutStep) => {
  if (step === 3 && shouldStartInReviewStep.value) return true;
  if (step === 1) return true;
  if (step === 2) return addressStepComplete.value;
  return addressStepComplete.value && shippingPaymentStepComplete.value;
};

const goToStep = (step: CheckoutStep) => {
  if (!canOpenStep(step)) return;
  currentStep.value = step;
};

const stepButtonClass = (step: CheckoutStep) => {
  if (currentStep.value === step) return 'bg-primary-50 text-primary-700';
  if (canOpenStep(step)) return 'text-neutral-900 hover:bg-neutral-50';
  return 'text-neutral-400 cursor-not-allowed';
};

const stepIndicatorClass = (step: CheckoutStep) => {
  if (currentStep.value === step) return 'border-primary-700 bg-primary-700 text-white';
  if (canOpenStep(step)) return 'border-primary-500 text-primary-700';
  return 'border-neutral-300 text-neutral-500';
};

const validateAddressStep = () => {
  if (anyAddressFormIsOpen.value) {
    trackCheckoutBarrier('Unsaved address');
    send({ type: 'secondary', message: t('address.unsavedWarning') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value) {
    trackCheckoutBarrier('Missing shipping address');
    send({ type: 'secondary', message: t('error.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  if (!hasBillingAddress.value) {
    trackCheckoutBarrier('Missing billing address');
    send({ type: 'secondary', message: t('error.checkout.missingAddress') });
    scrollToBillingAddress();
    return false;
  }

  return true;
};

const continueFromAddress = () => {
  if (!validateAddressStep()) return;
  currentStep.value = 2;
};

const continueFromShippingPayment = () => {
  if (!validateAddressStep()) {
    currentStep.value = 1;
    return;
  }

  if (!shippingPaymentStepComplete.value) {
    trackCheckoutBarrier('Missing shipping or payment method');
    send({ type: 'secondary', message: t('krausesohn.checkout.missingShippingPayment') });
    return;
  }

  currentStep.value = 3;
};

const continueFromCurrentStep = () => {
  if (currentStep.value === 1) {
    continueFromAddress();
    return;
  }

  if (currentStep.value === 2) {
    continueFromShippingPayment();
  }
};

const trackPaymentInteraction = () => {
  if (anyAddressFormIsOpen.value) {
    trackCheckoutBarrier('Unsaved address');
    return;
  }

  if (!hasShippingAddress.value || !hasBillingAddress.value) {
    trackCheckoutBarrier('Missing address');
    return;
  }

  if (!selectedMethod.value || !selectedPaymentId.value) {
    trackCheckoutBarrier('Missing shipping or payment method');
    return;
  }

  const shippingTermsRequired = shippingProviderGetters.getDataPrivacyAgreementHint(selectedMethod.value);
  if (shippingTermsRequired && !shippingPrivacyAgreement.value) {
    trackCheckoutBarrier('Shipping terms missing');
    return;
  }

  trackCheckoutStep('04 Order attempted', selectedPaymentName.value || undefined);
};

watch([addressStepComplete, anyAddressFormIsOpen, checkoutReady], ([complete, formIsOpen, ready]) => {
  if (formIsOpen) {
    addressFormWasOpen.value = true;
    return;
  }

  if (stepCheckoutEnabled.value && currentStep.value === 1 && ready && complete && addressFormWasOpen.value) {
    addressFormWasOpen.value = false;
    currentStep.value = 2;
  }
});

watch(
  [checkoutReady, shouldStartInReviewStep],
  ([ready, startInReview]) => {
    if (stepCheckoutEnabled.value && ready && startInReview) {
      currentStep.value = 3;
    }
  },
  { immediate: true },
);

watch(cartIsEmpty, async () => {
  if (!processingOrder.value) {
    send({ type: 'neutral', message: t('cart.emptyNotification') });
    await navigateTo(localePath(paths.cart));
  }
});
</script>
