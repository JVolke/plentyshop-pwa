<template>
  <div v-if="showWidget"
       ref="widgetRef"
       class="shopauskunft-widget"
       data-widget-id="ffe45f3eaa94"
       data-widget-theme="light"
       data-retailer-id="krause-sohn"
       data-widget-locale="de_DE">
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { loadShopauskunftWidget } from '../utils/loadShopauskunft';

const route = useRoute();
const showWidget = ref(false);

// Seiten, auf denen das Widget **nicht** angezeigt werden soll
const hiddenRoutes = ['/checkout', '/login', '/confirmation']; // oder RegExp verwenden

// Reaktiv prüfen, ob wir gerade auf einer ausgeschlossenen Route sind
const isHidden = computed(() => hiddenRoutes.includes(route.path));

watch(route, async () => {
  // neu prüfen bei Navigation
  if (!isHidden.value) {
    showWidget.value = true;
    await nextTick();
    await loadShopauskunftWidget();
  } else {
    showWidget.value = false;
  }
}, { immediate: true });

onMounted(async () => {
  if (!isHidden.value) {
    showWidget.value = true;
    await nextTick();
    await loadShopauskunftWidget();
  }
});
</script>
