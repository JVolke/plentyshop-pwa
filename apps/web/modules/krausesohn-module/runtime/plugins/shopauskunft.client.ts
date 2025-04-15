// plugins/load-shopauskunft-after-widget.client.ts
import { defineNuxtPlugin, ref, watch, onMounted } from "#imports";

export default defineNuxtPlugin(() => {
  const scriptId = 'shopauskunft-global';
  const scriptUrl = 'https://widget.shopauskunft.de/assets/widget.js';
  const targetElementSelector = '.shopauskunft-widget';

  const isWidgetPresent = ref(false);

  const loadScript = () => {
    if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptUrl;
      script.onload = () => {
        console.log('Shopauskunft-Skript geladen, da .shopauskunft-widget vorhanden war.');
      };
      script.onerror = (error) => {
        console.error('Fehler beim Laden des Shopauskunft-Skripts:', error);
      };
      document.head.appendChild(script);
    }
  };

  const checkWidget = () => {
    if (typeof document !== 'undefined' && document.querySelector(targetElementSelector)) {
      isWidgetPresent.value = true;
    }
  };

  onMounted(() => {
    // Initialprüfung beim Mounten der App (clientseitig)
    checkWidget();

    // Beobachten Sie Änderungen im DOM (optional, falls das Widget dynamisch geladen wird)
    // const observer = new MutationObserver(checkWidget);
    // observer.observe(document.body, { subtree: true, childList: true });

    // Laden Sie das Skript, sobald das Widget-Element vorhanden ist
    watch(isWidgetPresent, (newValue: boolean) => {
      if (newValue) {
        loadScript();
        // Wenn der Observer verwendet wird, kann er hier gestoppt werden (optional)
        // if (observer) {
        //   observer.disconnect();
        // }
      }
    });
  });

  // Alternative: Einfach einmalig nach einer Verzögerung prüfen (weniger reaktiv)
  // onMounted(() => {
  //   setTimeout(() => {
  //     checkWidget();
  //     if (isWidgetPresent.value) {
  //       loadScript();
  //     }
  //   }, 500); // Beispielhafte Verzögerung
  // });
});
