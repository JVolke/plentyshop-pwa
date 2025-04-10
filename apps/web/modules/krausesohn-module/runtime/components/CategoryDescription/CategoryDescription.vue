<template>
  <div v-if="description !== undefined" class="w-full no-preflight">
    <div class="categoryContent" v-html="description" />
  </div>
</template>
<script setup lang="ts">
import { categoryGetters } from '@plentymarkets/shop-api';
import type { CategoryDescriptionProps } from '~/modules/krausesohn-module/runtime/components/CategoryDescription/types';

const { category } = defineProps<CategoryDescriptionProps>();
let description: string | undefined;
if (category !== undefined)
{
  description = categoryGetters.getCategoryDetails(category)?.description;
}
else
{
  description = undefined;
}


</script>
<style>
.categoryContent .table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}

.categoryContent .table th,
.categoryContent .table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.categoryContent .table thead th {
  vertical-align: bottom;
}

.categoryContent .table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.categoryContent .table-bordered th,
.categoryContent .table-bordered td {
  border: 1px solid #dee2e6;
}

.categoryContent .table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.categoryContent .table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.categoryContent .table-sm th,
.categoryContent .table-sm td {
  padding: 0.375rem;
}

.categoryContent .table-responsive {
  overflow-x: auto;
}
@media (max-width: 575.98px) {
  .categoryContent .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
