import type { PaymentMethod } from '@plentymarkets/shop-api';

const RATEPAY_INVOICE_PAYMENT_ID = 6037;
const RATEPAY_INVOICE_DISPLAY_NAME = 'Rechnungskauf via Ratepay';

export const getPaymentMethodDisplayName = (paymentMethod?: Pick<PaymentMethod, 'id' | 'name'>): string => {
  if (!paymentMethod) return '';

  return paymentMethod.id === RATEPAY_INVOICE_PAYMENT_ID ? RATEPAY_INVOICE_DISPLAY_NAME : paymentMethod.name;
};
