<template>
  <NuxtLayout
    name="checkout"
    page-type="static"
    :back-label-desktop="t('common.actions.back')"
    :back-label-mobile="t('common.actions.back')"
    :heading="t('common.labels.checkout')"
  >
    <template v-if="stepCheckoutEnabled">
      <div v-if="cart" class="@lg:grid @lg:grid-cols-12 @lg:gap-x-6">
        <div class="col-span-6 @xl:col-span-7 mb-10 @lg:mb-0">
          <nav class="mb-6 border border-neutral-200 rounded-md bg-white" aria-label="Checkout steps">
            <ol class="grid grid-cols-1 @md:grid-cols-2">
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
            <UiDivider :class="dividerClass" />
            <ContactInformation disabled />
            <UiDivider :class="dividerClass" />
            <AddressContainer id="shipping-address" :key="0" :type="AddressType.Shipping" />
            <UiDivider :class="dividerClass" />
            <AddressContainer id="billing-address" :key="1" :type="AddressType.Billing" />
            <UiDivider :class="dividerClass" />
            <div v-if="addressStepComplete" class="flex justify-end p-4">
              <UiButton type="button" :disabled="interactionDisabled" @click="continueFromAddress">
                {{ t('krausesohn.checkout.continue') }}
              </UiButton>
            </div>
          </section>

          <section v-show="currentStep === 2" class="border border-neutral-200 rounded-md bg-white">
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
                  <h3 class="font-bold mb-2">{{ t('shipping.method.heading') }}</h3>
                  <p class="text-sm text-neutral-700">{{ selectedShippingMethodName }}</p>
                  <p v-if="selectedShippingAmountLabel" class="text-sm text-neutral-500">
                    {{ selectedShippingAmountLabel }}
                  </p>
                </section>

                <section class="border border-neutral-200 rounded-md p-4">
                  <h3 class="font-bold mb-2">{{ t('checkout.payment.heading') }}</h3>
                  <p class="text-sm text-neutral-700">{{ selectedPaymentName }}</p>
                </section>
              </div>

              <div class="mb-6 @lg:hidden">
                <h3 class="font-bold mb-3">{{ t('krausesohn.checkout.products') }}</h3>
                <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
                  <UiCartProductCard disabled :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
                </div>
              </div>

              <CustomerReference />
              <CustomerWish />
              <UiDivider :class="`${dividerClass} my-6`" />
              <div class="text-sm">
                <CheckoutGeneralTerms />
              </div>
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
                  <UiCartProductCard disabled :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
                </div>
              </div>
            </div>

            <OrderSummary v-if="cart" :cart="cart" class="@lg:shrink-0">
              <template v-if="currentStep === 1">
                <UiButton
                  class="w-full"
                  :disabled="!addressStepComplete || interactionDisabled"
                  @click="continueFromAddress"
                >
                  {{ t('krausesohn.checkout.continue') }}
                </UiButton>
              </template>

              <template v-else>
                <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
                <div v-if="loading">
                  <UiButton class="w-full py-3" :disabled="true">
                    <SfLoaderCircular class="flex justify-center items-center" size="sm" />
                  </UiButton>
                </div>
                <div v-else-if="payPalAvailable">
                  <template v-if="changedTotal">
                    <PayPalExpressButton
                      v-if="changedTotal"
                      :disabled="interactionDisabled"
                      type="Checkout"
                      location="checkoutPage"
                      @validation-callback="payPalValidateCallback"
                    />
                    <PayPalPayLaterBanner placement="payment" location="checkoutPage" :amount="initialTotal" />
                  </template>

                  <UiButton
                    v-else
                    type="submit"
                    :disabled="interactionDisabled"
                    size="lg"
                    data-testid="place-paypal-order-button"
                    class="w-full cursor-pointer"
                    @click="buy"
                  >
                    <SfLoaderCircular v-if="interactionDisabled" class="flex justify-center items-center" size="sm" />
                    <template v-else>{{ t('common.actions.buy') }}</template>
                  </UiButton>
                </div>
                <div v-else>
                  <div
                    class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm @md:typography-text-base py-1 rounded-md mb-4"
                  >
                    <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
                    <div class="py-2 mr-2">
                      {{ t('paypalPayment.expressNotAvailable') }}
                    </div>
                  </div>
                  <NuxtLink :to="localePath(paths.checkout)">
                    <UiButton class="w-full">{{ t('common.actions.goToCheckout') }}</UiButton>
                  </NuxtLink>
                </div>
                <UiButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  :disabled="unreserveLoading || interactionDisabled || loading"
                  data-testid="cancel-paypal-order-button"
                  class="w-full mt-4 mb-4 @md:mb-0 cursor-pointer"
                  @click="cancelOrder"
                >
                  <SfLoaderCircular v-if="unreserveLoading" class="flex justify-center items-center" size="sm" />
                  <template v-else>{{ t('common.actions.cancelOrder') }}</template>
                </UiButton>
              </template>
            </OrderSummary>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="cart" class="@md:grid @md:grid-cols-12 @md:gap-x-6">
        <div class="col-span-7 mb-10 @md:mb-0">
          <UiDivider :class="dividerClass" />
          <ContactInformation disabled />
          <UiDivider :class="dividerClass" />
          <AddressContainer id="shipping-address" :key="0" :type="AddressType.Shipping" />
          <UiDivider :class="dividerClass" />
          <AddressContainer id="billing-address" :key="1" :type="AddressType.Billing" />
          <UiDivider :class="dividerClass" />
          <div class="relative">
            <ShippingMethod :loading="loading" disabled />
          </div>
          <UiDivider :class="dividerClass" />
          <CustomerReference />
          <CustomerWish />
          <UiDivider :class="`${dividerClass} mb-10`" />
          <div class="text-sm mx-4 @md:pb-0">
            <CheckoutGeneralTerms />
          </div>
        </div>
        <div class="col-span-5">
          <div v-for="cartItem in cart?.items" :key="cartItem.id">
            <UiCartProductCard disabled :cart-item="cartItem" />
          </div>
          <div
            class="relative @md:sticky mt-4 @md:top-20 h-fit"
            :class="{ 'pointer-events-none opacity-50': cartLoading }"
          >
            <SfLoaderCircular
              v-if="cartLoading"
              class="absolute top-[130px] right-0 left-0 m-auto z-loader"
              size="2xl"
            />
            <OrderSummary v-if="cart" :cart="cart">
              <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
              <div v-if="loading">
                <UiButton class="w-full py-3" :disabled="true">
                  <SfLoaderCircular class="flex justify-center items-center" size="sm" />
                </UiButton>
              </div>
              <div v-else-if="payPalAvailable">
                <template v-if="changedTotal">
                  <PayPalExpressButton
                    v-if="changedTotal"
                    :disabled="interactionDisabled"
                    type="Checkout"
                    location="checkoutPage"
                    @validation-callback="payPalValidateCallback"
                  />
                  <PayPalPayLaterBanner placement="payment" location="checkoutPage" :amount="initialTotal" />
                </template>

                <UiButton
                  v-else
                  type="submit"
                  :disabled="interactionDisabled"
                  size="lg"
                  data-testid="place-paypal-order-button"
                  class="w-full cursor-pointer"
                  @click="buy"
                >
                  <SfLoaderCircular v-if="interactionDisabled" class="flex justify-center items-center" size="sm" />
                  <template v-else>{{ t('common.actions.buy') }}</template>
                </UiButton>
              </div>
              <div v-else>
                <div
                  class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm @md:typography-text-base py-1 rounded-md mb-4"
                >
                  <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
                  <div class="py-2 mr-2">
                    {{ t('paypalPayment.expressNotAvailable') }}
                  </div>
                </div>
                <NuxtLink :to="localePath(paths.checkout)">
                  <UiButton class="w-full">{{ t('common.actions.goToCheckout') }}</UiButton>
                </NuxtLink>
              </div>
              <UiButton
                type="button"
                variant="secondary"
                size="lg"
                :disabled="unreserveLoading || interactionDisabled || loading"
                data-testid="cancel-paypal-order-button"
                class="w-full mt-4 mb-4 @md:mb-0 cursor-pointer"
                @click="cancelOrder"
              >
                <SfLoaderCircular v-if="unreserveLoading" class="flex justify-center items-center" size="sm" />
                <template v-else>{{ t('common.actions.cancelOrder') }}</template>
              </UiButton>
            </OrderSummary>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType, cartGetters, shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfIconWarning, SfLoaderCircular } from '@storefront-ui/vue';
import type { PayPalAddToCartCallback } from '#paypal/types';
import type { Locale } from '#i18n';

type ReadonlyCheckoutStep = 1 | 2;

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const ID_CHECKBOX = '#terms-checkbox';
const localePath = useLocalePath();
const route = useRoute();
const { send } = useNotification();
const { loginAsGuest, user } = useCustomer();
const { fetchSession } = useFetchSession();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { data: cart, cartIsEmpty, loading: cartLoading } = useCart();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { emit } = usePlentyEvent();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const loading = ref(true);
const currentStep = ref<ReadonlyCheckoutStep>(2);
const addressFormWasOpen = ref(false);
const { format } = usePriceFormatter();
const { getSetting: getStepCheckoutSetting } = useSiteSettings('enableKrauseStepCheckout');
const {
  loading: executeOrderLoading,
  createPlentyOrder,
  captureOrder,
  createPlentyPaymentFromPayPalOrder,
  setAddressesFromPayPal,
  getScript,
} = usePayPal();
const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
const { setInitialCartTotal, changedTotal, initialTotal } = useCartTotalChange();
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const { paymentLoading, shippingLoading, selectedPaymentId } = useCheckoutPagePaymentAndShipping();
const { selectedMethod } = useCartShippingMethods();
const { unreserve, loading: unreserveLoading } = useCartStockReservation();

const { checkoutAddress: billingAddress, set: setBillingAddress } = useCheckoutAddress(AddressType.Billing);
const { checkoutAddress: shippingAddress, set: setShippingAddress } = useCheckoutAddress(AddressType.Shipping);
const {
  shippingPrivacyAgreement,
  customerWish,
  customerSign,
  doAdditionalInformation,
  loading: additionalInformationLoading,
} = useAdditionalInformation();
const {
  anyAddressFormIsOpen,
  hasShippingAddress,
  hasBillingAddress,
  persistShippingAddress,
  persistBillingAddress,
  backToFormEditing,
  scrollToShippingAddress,
  scrollToBillingAddress,
  setBillingSkeleton,
  setShippingSkeleton,
} = useCheckout();

const paypalOrderId = route?.query?.orderId?.toString() || '';
const dividerClass = 'w-screen @md:w-auto -mx-4 @md:mx-0';
const stepCheckoutEnabled = computed(() => String(getStepCheckoutSetting()) !== 'false');
const disableShippingPayment = computed(() => shippingLoading.value || paymentLoading.value);
const interactionDisabled = computed(
  () =>
    disableShippingPayment.value ||
    additionalInformationLoading.value ||
    cartLoading.value ||
    navigationInProgress.value ||
    processingOrder.value ||
    executeOrderLoading.value,
);
const addressStepComplete = computed(
  () => hasShippingAddress.value && hasBillingAddress.value && !anyAddressFormIsOpen.value,
);
const payPalAvailable = computed(() =>
  paymentMethodData?.value?.list?.find((method) => method.paymentKey === 'PAYPAL' && method.key === 'plentyPayPal'),
);
const selectedPaymentName = computed(
  () =>
    paymentMethodData.value?.list?.find((payment) => payment.id === selectedPaymentId.value)?.name ||
    payPalAvailable.value?.name ||
    'PayPal',
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
const steps = [
  {
    id: 1,
    label: t('krausesohn.checkout.addressStep'),
    description: t('krausesohn.checkout.addressStepDescription'),
  },
  {
    id: 2,
    label: t('krausesohn.checkout.reviewStep'),
    description: t('krausesohn.checkout.reviewStepDescription'),
  },
] as const;

const canOpenStep = (step: ReadonlyCheckoutStep) => step === 1 || addressStepComplete.value;

const goToStep = (step: ReadonlyCheckoutStep) => {
  if (!canOpenStep(step)) return;
  currentStep.value = step;
};

const stepButtonClass = (step: ReadonlyCheckoutStep) => {
  if (currentStep.value === step) return 'bg-primary-50 text-primary-700';
  if (canOpenStep(step)) return 'text-neutral-900 hover:bg-neutral-50';
  return 'text-neutral-400 cursor-not-allowed';
};

const stepIndicatorClass = (step: ReadonlyCheckoutStep) => {
  if (currentStep.value === step) return 'border-primary-700 bg-primary-700 text-white';
  if (canOpenStep(step)) return 'border-primary-500 text-primary-700';
  return 'border-neutral-300 text-neutral-500';
};

const handle = async () => {
  if (!paypalOrderId) {
    await unreserve();
    return navigateTo(localePath(paths.cart));
  }
  const payPalScript = await getScript(currency.value);
  if (!payPalScript) {
    send({ type: 'negative', message: t('paypalPayment.expressNotAvailable') });
    await unreserve();
    return navigateTo(localePath(paths.cart));
  }

  await setAddressesFromPayPal(paypalOrderId);
  await fetchSession();

  await useFetchAddressesData()
    .fetch()
    .then(() => persistShippingAddress())
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error))
    .finally(() => {
      setBillingSkeleton(false);
      setShippingSkeleton(false);
    });

  if (user.value === null && (billingAddress.value?.email || shippingAddress.value?.email)) {
    await loginAsGuest(billingAddress.value?.email || shippingAddress.value?.email || '');

    if (!billingAddress.value) {
      await setBillingAddress(shippingAddress.value);
    } else if (!shippingAddress.value) {
      await setShippingAddress(billingAddress.value);
    }
  }

  if (user.value === null) {
    await unreserve();
    return navigateTo(localePath(paths.checkout));
  }

  await usePayPal().updateAvailableAPMs(payPalScript, currency.value);
  await Promise.all([
    useCartShippingMethods().getShippingMethods(),
    fetchPaymentMethods(),
    useAggregatedCountries().fetchAggregatedCountries(),
  ]);

  await setInitialCartTotal();

  loading.value = false;
};

const validateAddressStep = () => {
  if (anyAddressFormIsOpen.value) {
    send({ type: 'secondary', message: t('address.unsavedWarning') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value) {
    send({ type: 'secondary', message: t('error.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  if (!hasBillingAddress.value) {
    send({ type: 'secondary', message: t('error.checkout.missingBillingAddress') });
    scrollToBillingAddress();
    return false;
  }

  return true;
};

const continueFromAddress = () => {
  if (!validateAddressStep()) return;
  currentStep.value = 2;
};

const scrollToTerms = () => {
  scrollToHTMLObject(ID_CHECKBOX);
  setShowErrors(true);
};

const validateFields = async () => {
  if (interactionDisabled.value) return false;

  if (cartIsEmpty.value) {
    send({ type: 'neutral', message: t('cart.emptyNotification') });
    await navigateTo(localePath(paths.cart));
    return false;
  }

  if (!validateAddressStep()) {
    currentStep.value = 1;
    return false;
  }

  if (!termsAccepted.value) {
    scrollToTerms();
    return false;
  }

  await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
    orderCustomerSign: customerSign.value,
  });

  return true;
};

const payPalValidateCallback = async (callback?: PayPalAddToCartCallback) => {
  if (callback) callback(await validateFields());
};

const buy = async () => {
  if (await validateFields()) {
    const order = await createPlentyOrder();

    if (order) {
      await captureOrder(paypalOrderId);
      await createPlentyPaymentFromPayPalOrder(paypalOrderId, order.order.id);

      useDynamicPaymentButtons().createOrderLoading.value = true;
      emit('module:clearCart', null);

      if (order?.order?.id) {
        emit('frontend:orderCreated', order);
        navigateTo(localePath(`${paths.confirmation}/${order.order.id}/${order.order.accessKey}`));
      }
    } else {
      send({ type: 'negative', message: t('paypalPayment.invalidOrder') });
      navigateTo(localePath(paths.cart));
    }
  }
};

const cancelOrder = async () => {
  await unreserve();
  await navigateTo(localePath(paths.cart));
};

watch(payPalAvailable, async (newValue) => {
  if (newValue) {
    if (cart.value.methodOfPaymentId !== newValue.id) {
      await savePaymentMethod(newValue.id);
    }
  }
});

watch([addressStepComplete, anyAddressFormIsOpen], ([complete, formIsOpen]) => {
  if (formIsOpen) {
    addressFormWasOpen.value = true;
    return;
  }

  if (stepCheckoutEnabled.value && currentStep.value === 1 && complete && addressFormWasOpen.value) {
    addressFormWasOpen.value = false;
    currentStep.value = 2;
  }
});

onMounted(() => {
  handle();
});
</script>
