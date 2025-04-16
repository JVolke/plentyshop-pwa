// plugins/load-shopauskunft-after-widget.client.ts
import { defineNuxtPlugin, ref, watch, onMounted } from "#imports";

export default defineNuxtPlugin(() => {
  const scriptId = 'shopauskunft-global';
  const scriptUrl = 'https://widget.shopauskunft.de/assets/widget.js';
  const script = document.createElement('script');
  script.src = scriptUrl;
  document.addEventListener('DOMContentLoaded', () => {
    console.log("Ready");
    document.head.appendChild(script);
  })


});
