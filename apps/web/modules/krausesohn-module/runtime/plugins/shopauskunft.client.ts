import { defineNuxtPlugin, useRouter } from '#app';

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const scriptId = 'shopauskunft-global';
  const scriptUrl = 'https://widget.shopauskunft.de/assets/widget.js';
  const forbiddenRoutes = ['/checkout']; // Routen, auf denen das Widget geladen werden soll

  const loadScript = () => {
    if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptUrl;
      script.onload = () => {
        console.log('Shopauskunft-Skript global geladen.');
        // Ggf. globale Initialisierungsfunktionen hier aufrufen
      };
      script.onerror = (error) => {
        console.error('Fehler beim Laden des Shopauskunft-Skripts:', error);
      };
      document.head.appendChild(script);
    }
  };

  const removeScript = () => {
    if (typeof document !== 'undefined') {
      const scriptTag = document.getElementById(scriptId);
      if (scriptTag) {
        document.head.removeChild(scriptTag);
        console.log('Shopauskunft-Skript global entfernt.');
      }
    }
  };

  // Funktion zum Überprüfen, ob das Skript geladen werden soll
  const shouldLoadScript = (path: string) => {
    return forbiddenRoutes.includes(path);
  };

  // Initiales Laden beim Mounten der App (clientseitig)
  if (!shouldLoadScript(router.currentRoute.value.path)) {
    loadScript();
  }

  // Auf Routenänderungen reagieren
  router.afterEach((to) => {
    if (shouldLoadScript(to.path)) {
      loadScript();
    } else {
      removeScript();
    }
  });
});
