<template>
  <UiOverlay :visible="modelValue" :class="overlayClasses">
    <SfModal class="md:max-h-[min(calc(100vh-32px),100%)]" v-bind="{ ...$attrs, ...props }">
      <slot />
    </SfModal>
  </UiOverlay>
</template>

<script setup lang="ts">
import { SfModal } from '@storefront-ui/vue';
import type { ModalProps } from '~/components/ui/Modal/types';

const props = defineProps<ModalProps>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
