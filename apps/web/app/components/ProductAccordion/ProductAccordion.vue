<template>
  <div data-testid="product-accordion">
    <UiAccordionItem
      v-if="productGetters.getDescription(product)?.length"
      v-model="productDetailsOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ t('product.details') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getDescription(product)" />
    </UiAccordionItem>
    <UiDivider v-if="productDetailsOpen && productGetters.getDescription(product)?.length" class="mb-2 mt-2" />
    <UiAccordionItem
      v-if="productGetters.getTechnicalData(product)?.length"
      v-model="technicalDataOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ t('common.labels.technicalData') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getTechnicalData(product)" />
    </UiAccordionItem>
    <UiDivider v-if="technicalDataOpen && productGetters.getTechnicalData(product)?.length" class="mb-2 mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ProductAccordionPropsType } from '~/components/ProductAccordion/types';

const props = defineProps<ProductAccordionPropsType>();
const { t } = useI18n();

const { product } = toRefs(props);

const productDetailsOpen = ref(true);
const technicalDataOpen = ref(false);
</script>
<style>
table {
  width: 100%!important;
  margin-bottom: 1rem;
  color: #212529;
  border: 1px solid grey;
}

table th,
table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

table thead th {
  vertical-align: bottom;
}

table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.table-sm th,
.table-sm td {
  padding: 0.375rem;
}

.table-responsive {
  overflow-x: auto;
}
@media (max-width: 575.98px) {
  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
