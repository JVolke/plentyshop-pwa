import type { FacetSearchCriteria, Product, Facet } from '@plentymarkets/shop-api';
import { defaults, type SetCurrentProduct } from '~/composables';
import type { UseProductsState, FetchProducts, UseProductsReturn } from '~/composables/useProducts/types';

/**
 * @description Composable for managing products.
 * @returns UseProductsReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, selectedVariation, fetchProducts, selectVariation } = useProducts();
 * ```
 */
export const useProducts: UseProductsReturn = (category = '') => {
  const state = useState<UseProductsState>(`useProducts${category}`, () => ({
    data: {} as Facet,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
    currentProduct: {} as Product,
  }));

  const nuxtApp = useNuxtApp(); // Instanz holen

  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    state.value.loading = true;

    if (params.categoryUrlPath?.endsWith('.js')) return state.value.data;
    const identifier = category || params.categoryUrlPath || params.categoryId;

    let fetchedData;

    // *** DIESER BLOCK IST DIE KRITISCHE ÄNDERUNG ZUM TESTEN ***
    // Verwende useAsyncData nur auf dem Server oder bei der initialen Hydration.
    // Ansonsten (nach der Hydration im Browser, wenn der User filtert/sortiert),
    // erzwingen wir einen direkten Fetch über useSdk().
    if (import.meta.server || nuxtApp.isHydrating) {
      // Den Key dynamischer machen, um alle relevanten Parameter einzubeziehen
      // Dies zwingt useAsyncData, einen neuen Fetch zu machen, wenn sich NUR params ändern
      const dynamicKey = `useProducts-${identifier}-${JSON.stringify(params || {})}`; // params kann undefined sein, daher {}
      const { data } = await useAsyncData(dynamicKey, () => useSdk().plentysystems.getFacet(params), {
        // Optional: Falls Sie useAsyncData nur einmal auf dem Server haben wollen
        // immediate: process.server, // Nur auf dem Server ausführen
      });
      fetchedData = data.value;
    } else {
      // Client-seitiger Fetch nach der Hydration (Benutzerinteraktion)
      fetchedData = await useSdk().plentysystems.getFacet(params);
    }
    // ************************************************************

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (fetchedData?.data) {
      fetchedData.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;
      state.value.data = fetchedData.data;
    } else {
      // Wenn fetchedData kein data hat, z.B. bei einem Fehler,
      // stellen Sie sicher, dass state.value.data nicht leer ist
      state.value.data = {} as Facet; // Oder eine geeignete Fehlermeldung
    }

    state.value.loading = false;
    return state.value.data;
  };

  const setCurrentProduct: SetCurrentProduct = async (product: Product) => {
    state.value.loading = true;
    state.value.currentProduct = product;
    state.value.loading = false;
  };

  return {
    fetchProducts,
    setCurrentProduct,
    ...toRefs(state.value),
  };
};
