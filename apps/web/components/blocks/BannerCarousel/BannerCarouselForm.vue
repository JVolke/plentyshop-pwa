<template>
  <div
    data-testid="banner-carousel-form"
    class="block-slider-edit sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto"
  >
    <div class="mb-6">
      <div class="flex item-center justify-between mb-4 p-4 pr-2">
        <h2>Slides</h2>
        <div class="flex item-center">
          <button
            data-testid="quick-add-slide-button"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
            @click="addSlide"
          >
            <SfIconAdd class="text-neutral-500" />
          </button>
          <div class="relative">
            <button
              v-if="slides.length >= 2"
              data-testid="open-slide-actions"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              @click="open"
            >
              <SfIconMoreHoriz class="text-neutral-500" />
            </button>

            <div
              v-if="isOpen && slides.length >= 2"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
            >
              <div class="flex justify-end p-2">
                <SfIconClose class="cursor-pointer" @click="close" />
              </div>
              <hr />
              <div class="p-2">
                <div v-for="(_, index) in slides" :key="index" class="flex items-center justify-between p-2 rounded">
                  <div class="flex items-center">
                    <SfIconArrowUpward
                      v-if="index !== 0"
                      :data-testid="`actions-move-slide-up-${index}`"
                      class="cursor-pointer text-neutral-500 mr-2"
                      size="sm"
                      @click.stop="moveSlideUp(index)"
                    />
                    <SfIconArrowUpward
                      v-else
                      class="cursor-pointer text-neutral-500 mr-2 pointer-events-none opacity-50"
                      size="sm"
                    />

                    <SfIconArrowDownward
                      v-if="index + 1 !== slides.length"
                      :data-testid="`actions-move-slide-down-${index}`"
                      class="cursor-pointer text-neutral-500 mr-2"
                      size="sm"
                      @click.stop="moveSlideDown(index)"
                    />
                    <SfIconArrowDownward
                      v-else
                      class="cursor-pointer text-neutral-500 mr-2 pointer-events-none opacity-50"
                      size="sm"
                    />
                    <span>Slide {{ index + 1 }}</span>
                  </div>
                  <button
                    :data-testid="`actions-delete-slide-${index}`"
                    class="text-red-500 hover:text-red-700"
                    :disabled="slides.length === 1"
                    @click="deleteSlide(index)"
                  >
                    <SfIconDelete class="text-neutral-500" />
                  </button>
                </div>
                <hr />
                <div class="pl-2 pr-2 pt-2 flex justify-between items-center">
                  <p>Add Slide</p>
                  <button
                    data-testid="actions-add-slide-button"
                    class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
                    @click="addSlide"
                  >
                    <SfIconAdd class="text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SfScrollable
        class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <template #previousButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronLeft class="text-neutral-500" />
          </button>
        </template>

        <template #nextButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronRight class="text-neutral-500" />
          </button>
        </template>

        <div class="flex items-center gap-2 flex-nowrap">
          <button
            v-for="(_, index) in slides"
            :key="index"
            :data-testid="`slide-settings-${index}`"
            class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shrink-0"
            :class="activeSlide === index ? 'bg-editor-button text-white' : ''"
            @click="slideClick(index)"
          >
            Slide {{ index + 1 }}
          </button>
        </div>
      </SfScrollable>
    </div>

    <div :data-testid="`slide-settings-${activeSlide}`">
      <UiAccordionItem
        v-model="imagesOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="slider-image-group"
      >
        <template #summary>
          <h2 data-testid="slider-image-group-title">Images</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Image XL (Desktop)</UiFormLabel>
              <SfInput
                v-model="slides[activeSlide].image.wideScreen"
                name="desktopImage"
                data-testid="slide-4xl-image-input"
                type="text"
                placeholder="Enter URL of image"
              />
              <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
                Recommended dimensions: 1920 x 1080 px
              </div>
            </label>
          </div>
          <div class="mb-6">
            <label>
              <UiFormLabel class="mb-1">Image L (Desktop)</UiFormLabel>
              <SfInput
                v-model="slides[activeSlide].image.desktop"
                name="desktopImage"
                data-testid="slide-desktop-image-input"
                type="text"
                placeholder="Enter URL of image"
              />
              <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
                Recommended dimensions: 1024 x 576 px
              </div>
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Image M (Tablet)</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].image.tablet"
              name="desktopImage"
              type="text"
              placeholder="Enter URL of image"
            />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 768 x 432 px
            </div>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Image S (Mobile)</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].image.mobile"
              name="desktopImage"
              type="text"
              placeholder="Enter URL of image"
            />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 320 x 320 px
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium mb-4">Brightness</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="slides[activeSlide].image.brightness"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="slides[activeSlide].image.brightness"
                  type="number"
                  min="0"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'image')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Alt</UiFormLabel>
            <SfInput v-model="slides[activeSlide].image.alt" name="alt" type="text" data-testid="slide-alt-text" />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Alternative image text</div>
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="textOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="banner-text-group"
      >
        <template #summary>
          <h2 data-testid="slider-text-group-title">Text</h2>
        </template>

        <div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Pre-title</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].text.pretitle"
              name="preTitle"
              type="text"
              placeholder="PreTitle"
              data-testid="banner-input-pre-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Main title</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].text.title"
              name="mainTitle"
              type="text"
              placeholder="Title"
              data-testid="banner-input-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Subtitle</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].text.subtitle"
              name="subtitle"
              type="text"
              placeholder="SubTitle"
              data-testid="banner-input-sub-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Description</UiFormLabel>
            <SfTextarea
              v-model="slides[activeSlide].text.htmlDescription"
              name="description"
              data-testid="banner-text-content"
              type="text"
              class="w-full min-h-[232px]"
              placeholder="Text that supports HTML formatting"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Color</UiFormLabel>

            <SfInput v-model="slides[activeSlide].text.color" type="text">
              <template #suffix>
                <label
                  for="text-color"
                  :style="{ backgroundColor: slides[activeSlide].text.color }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="text-color" v-model="slides[activeSlide].text.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Background</UiFormLabel>
            <SfSwitch
              v-model="slides[activeSlide].text.background"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
          <div v-if="slides[activeSlide].text.background" class="mb-6">
            <UiFormLabel class="mb-1">Textbox Color</UiFormLabel>

            <SfInput v-model="slides[activeSlide].text.bgcolor" type="text">
              <template #suffix>
                <label
                  for="text-bg-color"
                  :style="{ backgroundColor: slides[activeSlide].text.bgcolor }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input
                    id="text-bg-color"
                    v-model="slides[activeSlide].text.bgcolor"
                    type="color"
                    class="invisible w-8"
                  />
                </label>
              </template>
            </SfInput>
          </div>
          <div v-if="slides[activeSlide].text.background" class="mb-6">
            <label class="block text-sm font-medium mb-4">Textbox Opacity</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="slides[activeSlide].text.bgopacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="slides[activeSlide].text.bgopacity"
                  type="number"
                  min="0"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'text')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Alignment (x)</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="align-top"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.justify === 'top' }"
                data-testid="slider-textbox-align-top"
                @click="slides[activeSlide].text.justify = 'top'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.justify !== 'top' }"
                />
                Top
              </div>

              <div
                for="align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.justify === 'center' }"
                data-testid="slider-textbox-align-center"
                @click="slides[activeSlide].text.justify = 'center'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.justify !== 'center' }"
                />
                Center
              </div>

              <div
                for="align-bottom"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.justify === 'bottom' }"
                data-testid="slider-textbox-align-bottom"
                @click="slides[activeSlide].text.justify = 'bottom'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.justify !== 'bottom' }"
                />
                Bottom
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Alignment (y)</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="textbox-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.align === 'left' }"
                data-testid="slider-textbox-y-align-left"
                @click="slides[activeSlide].text.align = 'left'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.align !== 'left' }"
                />
                Left
              </div>

              <div
                for="textbox-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.align === 'center' }"
                data-testid="slider-textbox-y-align-center"
                @click="slides[activeSlide].text.align = 'center'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.align !== 'center' }"
                />
                Center
              </div>

              <div
                for="textbox-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.align === 'right' }"
                data-testid="slider-textbox-y-align-right"
                @click="slides[activeSlide].text.align = 'right'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.align !== 'right' }"
                />
                Right
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Alignment (y)</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="text-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.textAlignment === 'left',
                }"
                data-testid="slider-text-align-left"
                @click="slides[activeSlide].text.textAlignment = 'left'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.textAlignment !== 'left' }"
                />
                Left
              </div>

              <div
                for="text-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.textAlignment === 'center',
                }"
                data-testid="slider-text-align-center"
                @click="slides[activeSlide].text.textAlignment = 'center'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.textAlignment !== 'center' }"
                />
                Center
              </div>

              <div
                for="text-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].text.textAlignment === 'right',
                }"
                data-testid="slider-text-align-right"
                @click="slides[activeSlide].text.textAlignment = 'right'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].text.textAlignment !== 'right' }"
                />
                Right
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="buttonOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2 data-testid="slider-button-group-title">Button</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Label</UiFormLabel>
              <SfInput
                v-model="slides[activeSlide].button.label"
                data-testid="slider-button-label"
                name="label"
                type="text"
                placeholder="Button"
              />
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Link Target</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].button.link"
              name="link"
              data-testid="slider-button-link"
              type="text"
              placeholder="Enter URL here"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Variant</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{ 'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].button.variant === 'primary' }"
                data-testid="slider-button-primary"
                @click="slides[activeSlide].button.variant = 'primary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].button.variant !== 'primary' }"
                />
                Primary
              </div>

              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': slides[activeSlide].button.variant === 'secondary',
                }"
                data-testid="slider-button-secondary"
                @click="slides[activeSlide].button.variant = 'secondary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: slides[activeSlide].button.variant !== 'secondary' }"
                />
                Secondary
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>
      <UiAccordionItem
        v-model="controlsOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Controls</h2>
        </template>

        <div class="controls">
          <div class="mb-6 mt-4">
            <UiFormLabel class="mb-1">Slider Controls Color</UiFormLabel>

            <SfInput v-model="controls.color" type="text">
              <template #suffix>
                <label
                  for="controls-color"
                  :style="{ backgroundColor: controls.color }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="controls-color" v-model="controls.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import {
  SfTextarea,
  SfScrollable,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconDelete,
  SfInput,
  SfIconMoreHoriz,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconAdd,
  SfIconCheck,
  SfSwitch,
  useDisclosure,
  SfIconClose,
} from '@storefront-ui/vue';
import type { BannerProps, BannerSlide } from './types';

const { isOpen, open, close } = useDisclosure();
const { blockIndex } = useSiteConfiguration();
const { data, updateBannerItems, setIndex, activeSlideIndex } = useHomepage();

const activeSlide = computed(() => activeSlideIndex.value[blockIndex.value]);
const sliderBlock = computed(() => (data.value.blocks[blockIndex.value].options || {}) as BannerSlide);

const slides = computed({
  get: () => {
    return sliderBlock.value?.bannerItems || [];
  },
  set: (value) => updateBannerItems(value, blockIndex.value),
});

const controls = computed(() => sliderBlock.value.controls);

const imagesOpen = ref(true);
const textOpen = ref(true);
const buttonOpen = ref(true);
const controlsOpen = ref(true);

const slideClick = (index: number) => {
  setIndex(blockIndex.value, index);
};

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);

  if (type === 'image') {
    slides.value[activeSlide.value].image.brightness = clamp(nextValue, 0, 1);
  }
  if (type === 'text') {
    slides.value[activeSlide.value].text.bgopacity = clamp(nextValue, 0, 1);
  }
};

const addSlide = async () => {
  const newSlide: BannerProps = {
    image: {
      wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      brightness: 0.5,
      alt: '',
    },
    text: {
      pretitle: 'PreTitle',
      title: 'Title',
      subtitle: 'SubTitle',
      htmlDescription: 'Text that supports HTML formatting',
      color: '#000',
      bgcolor: '#fff',
      bgopacity: 1,
      textAlignment: 'left',
      justify: 'center',
      align: 'left',
      background: false,
    },
    button: {
      label: 'Button',
      link: '/',
      variant: 'primary',
    },
  };

  slides.value = [...slides.value, newSlide];

  await nextTick();

  setIndex(blockIndex.value, slides.value.length - 1);
  close();
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  if (activeSlide.value === index) {
    setIndex(blockIndex.value, index - 1);
  }
  close();
  await nextTick();
};

const moveSlideUp = async (index: number) => {
  if (index <= 0) return;

  const newSlides = [...slides.value];

  [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
  slides.value = newSlides;

  await nextTick();

  if (activeSlide.value === index) {
    setIndex(blockIndex.value, index - 1);
  }
};

const moveSlideDown = async (index: number) => {
  if (index >= slides.value.length - 1) return;

  const newSlides = [...slides.value];

  [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
  slides.value = newSlides;

  await nextTick();

  if (activeSlide.value === index) {
    setIndex(blockIndex.value, index + 1);
  }
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
