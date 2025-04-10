import { defineNuxtPlugin, useHead } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  /**
   *  Add external JS
   * */
  if(import.meta.client)
  {
    useHead({
      script: [
        {
          id: "shopauskunft",
          src: "http://widget.shopauskunft.de/assets/widget.js",
        }
      ]
    })
  }
})
