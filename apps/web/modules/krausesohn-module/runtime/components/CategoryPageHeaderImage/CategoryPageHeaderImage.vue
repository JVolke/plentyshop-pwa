<template>
<div class="relative mb-2">
  <img :src="image" class="w-full"/>
  <div class="absolute top-0 left-1 text-white shadow-gray-50"><h1 class="[text-shadow:_2px_2px_2px_rgb(0_0_0_/_75%)] font-bold lg:text-5xl ">{{ title }}</h1></div>
</div>
</template>
<script setup lang="ts">
import type { CategoryPageImageHeaderProps } from "~/modules/krausesohn-module/runtime/components/CategoryPageHeaderImage/types";

const { title = "", image = "https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Kategorie-Banner/Deko-Banner-Desktop.webp" } = defineProps<CategoryPageImageHeaderProps>();

</script>
