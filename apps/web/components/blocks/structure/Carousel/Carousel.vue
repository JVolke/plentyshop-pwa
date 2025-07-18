<template>
  <NuxtErrorBoundary>
    <Swiper
      :key="content.length"
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :loop="true"
      :pagination="paginationConfig"
      :navigation="navigationConfig"
      class="!z-0 !w-full !max-h-[85vh]"
      @swiper="onSwiperInit"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(banner, slideIndex) in content" :key="slideIndex">
        <slot
          name="content"
          :content-block="banner"
          :index="getSlideAdjustedIndex(slideIndex)"
          :lazy-loading="slideIndex > 0 ? 'lazy' : 'eager'"
        />
      </SwiperSlide>
      <div
        v-if="enableModules"
        :class="`swiper-pagination swiper-pagination-${index} swiper-pagination-bullets swiper-pagination-horizontal`"
      />
    </Swiper>

    <div
      v-if="enableModules && handleArrows()"
      :key="`prev-${index}`"
      :class="`swiper-button-prev swiper-button-prev-${index}`"
      :style="{ color: configuration.controls.color + ' !important' }"
    />
    <div
      v-if="enableModules && handleArrows()"
      :key="`next-${index}`"
      :class="`swiper-button-next swiper-button-next-${index}`"
      :style="{ color: configuration.controls.color + ' !important' }"
    />
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import type { CarouselStructureProps } from './types';
import type { Swiper as SwiperType } from 'swiper';

const { activeSlideIndex, setIndex } = useCarousel();
const { content, index, configuration, meta } = defineProps<CarouselStructureProps>();
const isInternalChange = ref(false);

const handleArrows = () => {
  const viewport = useViewport();
  return !viewport.isLessThan('md');
};

const enableModules = computed(() => content.length > 1);
let slider: SwiperType | null = null;

const paginationConfig = computed(() => {
  return enableModules.value && configuration.controls.color
    ? {
        el: `.swiper-pagination-${index}`,
        clickable: true,
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary-500',
        renderBullet(index: number, className: string) {
          return `<span key="dot-${index}" class="${className}" style="background-color: ${configuration.controls.color}!important;"></span>`;
        },
      }
    : false;
});

const navigationConfig = computed(() => {
  return enableModules.value
    ? {
        nextEl: `.swiper-button-next-${index}`,
        prevEl: `.swiper-button-prev-${index}`,
      }
    : false;
});

const onSwiperInit = async (swiper: SwiperType) => {
  slider = swiper;

  if (activeSlideIndex.value[meta.uuid] === null) {
    setIndex(meta.uuid, swiper.realIndex);
  }
};
const reinitializeSwiper = async () => {
  if (!slider || slider.destroyed) return;

  await nextTick();

  slider.update();

  if (slider.params.navigation && slider.navigation) {
    slider.navigation.destroy();
    slider.navigation.init();
    slider.navigation.update();
  }

  if (slider.params.pagination && slider.pagination) {
    slider.pagination.destroy();
    slider.pagination.init();
    slider.pagination.update();
  }
};
const onSlideChange = async (swiper: SwiperType) => {
  const realIndex = swiper.realIndex;
  if (isInternalChange.value) {
    isInternalChange.value = false;
    return;
  }

  if (realIndex !== activeSlideIndex.value[meta.uuid]) {
    setIndex(meta.uuid, realIndex);
  }
};

const getSlideAdjustedIndex = (slideIndex: number) => {
  return activeSlideIndex.value[meta.uuid] === slideIndex ? index : index + slideIndex;
};

watch(
  () => activeSlideIndex.value[meta.uuid],
  (newIndex) => {
    if (!slider || slider.destroyed) return;

    if (slider.realIndex !== newIndex) {
      isInternalChange.value = true;
      if (slider.params.loop) {
        slider.slideToLoop(newIndex);
      } else {
        slider.slideTo(newIndex);
      }
    }
  },
  { flush: 'post' },
);
watch(
  () => content.length,
  async (newLength, oldLength) => {
    if (oldLength <= 1 && newLength > 1) {
      await reinitializeSwiper();
    }
  },
);
watch(
  () => configuration.controls.color,
  (newColor, oldColor) => {
    if (slider && !slider.destroyed && newColor !== oldColor) {
      slider.pagination.render();
      slider.pagination.update();
    }
  },
);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
