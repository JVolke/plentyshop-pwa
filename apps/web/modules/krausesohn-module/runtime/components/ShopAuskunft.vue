<template>
  <div class="shopauskunft-widget"  data-widget-id="ffe45f3eaa94" data-widget-theme="light" data-retailer-id="krause-sohn" data-widget-locale="de_DE">&nbsp;</div>
</template>
<script setup lang="ts">
import { useHead } from '#app';

useHead({
  script: [
    {
      id: "shopauskunft",
      src: "http://widget.shopauskunft.de/assets/widget.js",
      async: true
    }
  ]
});

</script>
