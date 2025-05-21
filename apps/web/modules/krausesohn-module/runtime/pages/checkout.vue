<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="cart" class="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div class="col-span-6 xl:col-span-7 mb-10 lg:mb-0">
        <UiDivider id="top-contact-information-divider" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation id="contact-information" />
        <UiDivider id="top-shipping-divider" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer id="shipping-address" :key="0" :type="AddressType.Shipping" />
        <UiDivider id="top-billing-divider" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer id="billing-address" :key="1" :type="AddressType.Billing" />
        <UiDivider id="bottom-billing-divider" class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative" :class="{ 'pointer-events-none opacity-50': disableShippingPayment }">
          <ShippingMethod :disabled="disableShippingPayment" @update:shipping-method="handleShippingMethodUpdate" />
          <SfLoaderCircular
            v-if="disableShippingPayment"
            class="absolute mt-5 right-0 left-0 m-auto z-[999]"
            size="2xl"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <PreferredDelivery v-if="countryHasDelivery" />
          <UiDivider v-if="preferredDeliveryAvailable" class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment :disabled="disableShippingPayment" @update:active-payment="handlePaymentMethodUpdate" />
        </div>
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
      </div>
      <div class="col-span-6 xl:col-span-5">
        <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
          <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
        </div>
        <div class="relative md:sticky md:top-20 h-fit" :class="{ 'pointer-events-none opacity-50': cartLoading }">
          <SfLoaderCircular v-if="cartLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <Coupon />
          <CustomerWish />
          <OrderSummary v-if="cart" :cart="cart" class="mt-4">
            <CheckoutGeneralTerms />
            <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
            <PaymentButtons />
            <ModuleComponentRendering area="checkout.afterBuyButton" />
          </OrderSummary>
        </div>
      </div>
    </div>

    <UiModal
      v-model="paypalCardDialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      tag="section"
      disable-click-away
    >
      <PayPalCreditCardForm @confirm-cancel="paypalCardDialog = false" />
    </UiModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { AddressType, cartGetters, paymentProviderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';
import {
  PayPalApplePayKey,
  PayPalCreditCardPaymentKey,
  PayPalGooglePayKey,
  PayPalPaymentKey,
} from '~/composables/usePayPal/types';
import { keyBy } from '~/utils/keyBy';

definePageMeta({
  layout: 'simplified-header-and-footer',
  pageType: 'static',
  middleware: ['reject-empty-checkout'],
});

const { send } = useNotification();
const { t } = useI18n();
const localePath = useLocalePath();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { emit } = usePlentyEvent();
const { checkboxValue: termsAccepted } = useAgreementCheckbox('checkoutGeneralTerms');
const { isGuest, isAuthorized, validGuestEmail, backToContactInformation } = useCustomer();
const { countryHasDelivery } = useCheckoutAddress(AddressType.Shipping);
const {
  cart,
  cartIsEmpty,
  clearCartItems,
  cartLoading,
  anyAddressFormIsOpen,
  persistShippingAddress,
  hasShippingAddress,
  persistBillingAddress,
  hasBillingAddress,
  backToFormEditing,
  validateTerms,
  scrollToShippingAddress,
} = useCheckout();
const { preferredDeliveryAvailable } = usePreferredDelivery();

const { fetchPaymentMethods } = usePaymentMethods();
useHead({
  title: "Kasse - Bestellung abschließen"
})
const {
  loadPayment,
  loadShipping,
  paymentMethods,
  selectedPaymentId,
  handleShippingMethodUpdate,
  handlePaymentMethodUpdate,
} = useCheckoutPagePaymentAndShipping();

const { setPageMeta } = usePageMeta();
const itemSumNet = computed(() => cartGetters.getItemSumNet(cart.value));

const icon = 'page';
setPageMeta(t('checkout'), icon);

emit('frontend:beginCheckout', cart.value);

const checkPayPalPaymentsEligible = async () => {
  if (import.meta.client) {
    const googlePayAvailable = await useGooglePay().checkIsEligible();
    const applePayAvailable = await useApplePay().checkIsEligible();

    if (googlePayAvailable || applePayAvailable) {
      await fetchPaymentMethods();
    }
  }
};

await Promise.all([
  useCartShippingMethods().getShippingMethods(),
  fetchPaymentMethods(),
  useAggregatedCountries().fetchAggregatedCountries(),
]);

onNuxtReady(async () => {
  await useFetchAddress(AddressType.Shipping)
    .fetchServer()
    .then(() => persistShippingAddress())
    .catch((error) => useHandleError(error));

  await useFetchAddress(AddressType.Billing)
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));

  await checkPayPalPaymentsEligible();
});

const paypalCardDialog = ref(false);
const disableShippingPayment = computed(() => loadShipping.value || loadPayment.value);
const { processingOrder } = useProcessingOrder();

const disableBuyButton = computed(
  () =>
    createOrderLoading.value ||
    disableShippingPayment.value ||
    cartLoading.value ||
    navigationInProgress.value ||
    processingOrder.value,
);


const readyToBuy = () => {
  if ((!isAuthorized.value && !isGuest.value) || (isGuest.value && !validGuestEmail.value)) {
    return backToContactInformation();
  }

  if (anyAddressFormIsOpen.value) {
    send({ type: 'secondary', message: t('unsavedAddress') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value || !hasBillingAddress.value) {
    send({ type: 'secondary', message: t('errorMessages.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  return validateTerms();
};


const handleRegularOrder = async () => {
  const data = await createOrder({
    paymentId: paymentMethods.value.selected,
    additionalInformation: { shippingPrivacyHintAccepted: shippingPrivacyAgreement.value },
  });

  if (data?.order?.id) {
    emit('frontend:orderCreated', data);
    clearCartItems();
    navigateTo(localePath(paths.confirmation + '/' + data.order.id + '/' + data.order.accessKey));
  }
};



const order = async () => {
  if (!readyToBuy()) return;

  processingOrder.value = true;
  const paymentMethodsById = keyBy(paymentMethods.value.list, 'id');

  paymentMethodsById[selectedPaymentId.value].key === 'plentyPayPal'
    ? (paypalCardDialog.value = true)
    : await handleRegularOrder();
};

watch(cartIsEmpty, async () => {
  if (!processingOrder.value) {
    send({ type: 'neutral', message: t('emptyCartNotification') });
    await navigateTo(localePath(paths.cart));
  }
});

watch(itemSumNet, async () => {
  await fetchPaymentMethods();
});
</script>
