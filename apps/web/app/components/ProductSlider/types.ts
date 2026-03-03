import type { HTMLAttributes } from 'vue';
import type { Product } from '@plentymarkets/shop-api';
export type VueClass = string | Record<string, any> | unknown[]


export type ProductSliderProps = {
  items?: Product[];
  wrapperClass?: VueClass;
  title?: string;
};

