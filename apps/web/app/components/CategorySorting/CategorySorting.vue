<template>
  <div class="w-full" data-testid="category-sorting">
    <div
      v-if="!selectionModeCompact"
      class="bg-primary-50/50 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ t('common.labels.sortBy') }}
    </div>
    <div class="px-4">
      <SfSelect id="sortBy" v-model="selected" :aria-label="t('common.labels.sortBy')" data-testid="select-sort-by">
        <option v-if="selectionModeCompact" value="" disabled hidden>{{ t('common.labels.sortBy') }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ t(`category.sorting.${option}`) }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { useRoute } from 'vue-router';
import { isPageOfType } from '~/utils/pathHelper';

const props = defineProps<{ selectionModeCompact?: boolean }>();
const { updateSorting } = useCategoryFilter();
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { getSetting: defaultSortingSearch } = useSiteSettings('defaultSortingSearch');
const { getSetting: defaultSortingOption } = useSiteSettings('defaultSortingOption');

const route = useRoute();
const categorySpecificDefault = computed(() => {
  const path = route.path;
  //variation.createdAt_desc
  if (path == "/fackeln/wachsfackeln")
      return 'variation.position_desc';
  else if (path == "/fasching/neuheiten-karneval/" || path == '/neuheiten-feuerwerk/')
    return 'variation.createdAt_desc'
  else
      return isPageOfType('search') ? defaultSortingSearch() : defaultSortingOption();
});


const useSelectionModeCompact = computed(() => props.selectionModeCompact);
watch(useSelectionModeCompact, (on) => {
  if (on) updateSorting('');
});
watchEffect(() => {
  const sortQueryParam = route.query.sort;
  const hasSortInQuery = typeof sortQueryParam === 'string' && sortQueryParam.length > 0;

  if (!hasSortInQuery && categorySpecificDefault.value) {
    updateSorting(categorySpecificDefault.value);
  }
});
const options = computed<string[]>(() => availableSortingOptions());
const defaultOption = computed<string | undefined>(() =>
  isPageOfType('search') ? defaultSortingSearch() : defaultSortingOption(),
);

const selected = computed<string>({
  get: () => {
    if (useSelectionModeCompact.value) return '';

    const sortQueryParam = route.query.sort;
    const currentSort = typeof sortQueryParam === 'string' ? sortQueryParam : '';
    if (currentSort && options.value.includes(currentSort)) return currentSort;

    return (
      (categorySpecificDefault.value && options.value.includes(categorySpecificDefault.value)
        ? categorySpecificDefault.value
        : options.value[0]) ?? ''
    );
  },
  set: (val) => {
    if (!val) return;
    updateSorting(val);
  },
});
</script>
