<template>
  <div
    v-if="displayNotification && notificationMessage"
    class="shop-notification bg-primary-500 text-white p-2 text-center text-sm md:text-base relative transition-all duration-500 ease-in-out"
    role="alert"
  >
    <div class="max-w-screen-2xl mx-auto flex items-center justify-between">
      <p class="flex-grow" v-html="notificationMessage" />
      <button
        aria-label="Nachricht schließen"
        class="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
        @click="dismissNotification"
      >
        <SfIconClose class="w-5 h-5" /> </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useSiteConfiguration } from '~/composables/useSiteConfiguration/useSiteConfiguration';
import { SfIconClose } from '@storefront-ui/vue'; // Oder eine andere Icon-Komponente / Bibliothek

const { notifyMessage } = useSiteConfiguration();
// Der Schlüssel, unter dem wir den Status im Session Storage speichern
const SESSION_STORAGE_KEY = 'shop_notification_dismissed';

// Reaktive Variable, die steuert, ob die Benachrichtigung angezeigt wird
const displayNotification = ref(false);

// Verwenden Sie eine computed Property, um auf den notifyMessage-Text zuzugreifen.
// Dies ist gut, falls notifyMessage in useSiteConfiguration reaktiv ist.
const notificationMessage = computed(() => notifyMessage.value || '');

// Beim Laden der Komponente prüfen, ob die Benachrichtigung bereits abgewiesen wurde
onMounted(() => {
  if (typeof localStorage  !== 'undefined') { // Sicherstellen, dass wir im Browser sind
    const dismissed = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!dismissed) {
      // Wenn nicht abgewiesen, anzeigen, falls ein Text vorhanden ist
      displayNotification.value = !!notificationMessage.value;
    }
  } else {
    // SSR-Fall: Anzeigen, falls ein Text vorhanden ist (kein Session Storage verfügbar)
    displayNotification.value = !!notificationMessage.value;
  }
});

// Beobachten, ob sich die Nachricht ändert (z.B. durch Backend-Updates oder Admin-Panel)
// Wenn sich die Nachricht ändert, sollte sie wieder angezeigt werden,
// selbst wenn sie vorher abgewiesen wurde, da es eine "neue" Nachricht ist.
watch(notificationMessage, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    // Wenn es eine neue Nachricht gibt, die nicht leer ist, anzeigen
    displayNotification.value = true;
    // Session Storage zurücksetzen, da es eine neue Nachricht ist
    if (typeof localStorage  !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } else if (!newValue) {
    // Wenn die Nachricht leer wird, ausblenden
    displayNotification.value = false;
    if (typeof localStorage  !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY); // Auch hier zurücksetzen
    }
  }
}, { immediate: true }); // Sofort ausführen beim Initialisieren

// Methode zum Abweisen der Benachrichtigung
const dismissNotification = () => {
  displayNotification.value = false;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, 'true'); // Im Session Storage merken
  }
};
</script>
