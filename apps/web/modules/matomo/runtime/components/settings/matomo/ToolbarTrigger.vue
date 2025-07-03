<template>
  <button
    type="button"
    class="editor-button relative py-2 flex justify-center"
    :class="{ 'bg-editor-button text-white rounded-md': active }"
    aria-label="Open matomo drawer"
    data-testid="open-matomo-drawer"
  >
    <NuxtImg v-if="active" width="24" height="24px" :src="paintBrushWhite" />
    <NuxtImg v-else width="24" height="24px" :src="paintBrushBlack" />
  </button>
</template>

<script setup lang="ts">
import paintBrushWhite from 'assets/icons/paths/M-white.svg';
import paintBrushBlack from 'assets/icons/paths/M-black.svg';

defineProps({
  active: Boolean,
});
</script>
