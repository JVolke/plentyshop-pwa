<template>
  <button
    v-if="isAiGeneratedImage"
    ref="badgeReference"
    type="button"
    :class="[
      'group absolute z-raised rounded bg-neutral-200 px-2 py-0.5 text-xs font-bold leading-5 text-neutral-800 shadow-sm ring-1 ring-neutral-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700',
      positionClass,
    ]"
    :aria-label="AI_IMAGE_NOTICE"
    @blur="closeTooltip"
    @click.stop.prevent="toggleTooltip"
    @mouseenter="showHoverTooltip"
    @mouseleave="hideHoverTooltip"
    @focus="showFocusTooltip"
  >
    KI
  </button>

  <Teleport to="body">
    <span
      v-if="isAiGeneratedImage && showTooltip"
      class="pointer-events-none fixed z-max w-max max-w-[220px] rounded bg-neutral-800 px-2 py-1 text-left text-xs font-normal leading-4 text-white shadow-md"
      :style="tooltipStyle"
    >
      {{ AI_IMAGE_NOTICE }}
    </span>
  </Teleport>
</template>

<script setup lang="ts">
const AI_IMAGE_NOTICE = 'Hinweis: KI generiertes Bild';

const props = defineProps<{
  alt?: string | null;
  positionClass?: string;
}>();

const isOpen = ref(false);
const isHovering = ref(false);
const isFocused = ref(false);
const badgeReference = ref<HTMLButtonElement | null>(null);
const tooltipPosition = ref({ left: 0, top: 0 });
const isAiGeneratedImage = computed(() => props.alt?.includes(AI_IMAGE_NOTICE) ?? false);
const positionClass = computed(() => props.positionClass || 'right-10 top-2');
const showTooltip = computed(() => isOpen.value || isHovering.value || isFocused.value);
const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.left}px`,
  top: `${tooltipPosition.value.top}px`,
}));

const updateTooltipPosition = async () => {
  await nextTick();

  const badge = badgeReference.value;
  if (!badge || !import.meta.client) return;

  const rect = badge.getBoundingClientRect();
  const tooltipWidth = 220;
  const viewportPadding = 8;
  const maxLeft = window.innerWidth - tooltipWidth - viewportPadding;

  tooltipPosition.value = {
    left: Math.max(viewportPadding, Math.min(rect.left, maxLeft)),
    top: rect.bottom + 6,
  };
};

const showHoverTooltip = () => {
  isHovering.value = true;
  updateTooltipPosition();
};

const hideHoverTooltip = () => {
  isHovering.value = false;
};

const showFocusTooltip = () => {
  isFocused.value = true;
  updateTooltipPosition();
};

const closeTooltip = () => {
  isFocused.value = false;
  isOpen.value = false;
};

const toggleTooltip = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) updateTooltipPosition();
};

onMounted(() => {
  window.addEventListener('scroll', updateTooltipPosition, { passive: true });
  window.addEventListener('resize', updateTooltipPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateTooltipPosition);
  window.removeEventListener('resize', updateTooltipPosition);
});
</script>
