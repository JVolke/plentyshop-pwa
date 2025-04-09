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
          src: "https://widget.shopauskunft.de/assets/widget.js",
          type: "text/javascript"
        }
      ]
    })
  }
})
