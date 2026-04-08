import type { Product } from '@plentymarkets/shop-api';

export type ProductSliderProps = {
  items?: Product[];
  title?: string;
  wrapperClass?: string | Record<string, unknown> | unknown[];
};
