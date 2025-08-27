<template>
  <span v-if="productPropertyGetters.getPropertyName(variationProperty)" class="font-semibold mr-2">
      {{ productPropertyGetters.getPropertyName(variationProperty) }}:
  </span>
  <template v-if="productPropertyGetters.getPropertyValue(variationProperty)">
    <img
      v-if="productPropertyGetters.getPropertyId(variationProperty) === 115"
      :src="imageSrc"
      :alt="productPropertyGetters.getPropertyValue(variationProperty)"
      width="80"
      height="80"
      class="float-right"
    />
    <a
      v-else-if="productPropertyGetters.getPropertyId(variationProperty) === 9"
      class="underline"
      href="/1/definition-feuerwerkskategorien"
      title="Definition der Feuerwerkskategorien"
      target="_blank"
    >
      {{ productPropertyGetters.getPropertyValue(variationProperty) }}
    </a>
    <button
      v-else-if="productPropertyGetters.getPropertyId(variationProperty) === 2 && productPropertyGetters.getPropertyValue(variationProperty)"
      type="button"
      class="text-primary-700"
      @click="openVideoModal"
    >
      Video abspielen
    </button>
    <span v-else-if="productPropertyGetters.getPropertyId(variationProperty) !== 2" >
        {{ productPropertyGetters.getPropertyValue(variationProperty) }}
      </span>
  </template>

  <teleport to="body">
    <div v-if="isVideoModalOpen" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeVideoModal">Schließen X</button>
        <div v-if="playVideo && productPropertyGetters.getPropertyValue(variationProperty)" class="video-container">
          <iframe
            width="560"
            height="315"
            :src="productPropertyGetters.getPropertyValue(variationProperty)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
        <button
          v-else-if="productPropertyGetters.getPropertyId(variationProperty) === 2 && productPropertyGetters.getPropertyValue(variationProperty)"
          @click="loadAndPlayVideo"
          class="play-button w-full">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
          Abspielen
        </button>
        <span class="data-privacy-hint inside">
            Hinweis: Beim Abspielen werden Daten an YouTube übertragen.
        </span>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { VariationPropertyTextProps } from './types';

const props = defineProps<VariationPropertyTextProps>();
const variationProperty = props.variationProperty;

const selectionImageMap: Record<number, string> = {
  170: '/piktos/acid_red_aetzend_korrosiv.gif',
  171: '/piktos/rondflam.gif',
  172: '/piktos/flamme.gif',
  173: '/piktos/silhouete_ernste_gesundheitsgefahr.gif',
  174: '/piktos/explos.gif',
  175: '/piktos/bottle_gase_unter_druck.png',
  177: '/piktos/skull_giftig.gif',
  178: '/piktos/Aquatic-pollut-red.gif',
}

const selectionId = variationProperty.values?.selectionId;
const imageSrc = selectionId
  ? selectionImageMap[selectionId]
  : '/images/default.png'; // Fallback-Bild

// Video Modal Logic
const isVideoModalOpen = ref(false);
const playVideo = ref(false);

const openVideoModal = () => {
  isVideoModalOpen.value = true;
};

const closeVideoModal = () => {
  isVideoModalOpen.value = false;
  playVideo.value = false;
};

const loadAndPlayVideo = () => {
  playVideo.value = true;
};
</script>

<style scoped>
.data-privacy-hint {
  font-size: 0.8em;
  color: #666;
  margin-left: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto; /* Ermöglicht Scrollen bei kleinen Bildschirmen */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 90%; /* Maximale Breite des Modals */
  max-height: 90%; /* Maximale Höhe des Modals */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.2em;
  border: none;
  background: none;
  z-index: 10; /* Stellt sicher, dass der Schließen-Button über dem Video liegt */
}

.play-button {
  margin-top:1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px; /* Etwas größer für bessere Bedienbarkeit */
  background-color: #f50707;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.play-button svg {
  width: 28px;
  height: 28px;
  margin-right: 10px;
}

.data-privacy-hint.inside {
  margin-left: 10px;
  font-size: 0.9em;
}

.video-container {
  margin-top:1.5rem;
  width: 100%; /* Nimmt die volle Breite des Modal-Contents ein */
  aspect-ratio: 16 / 9; /* Standard-Seitenverhältnis für YouTube */
}

.video-container iframe {
  width: 100%;
  height: 100%;
}
@media (min-width: 1200px){
  .modal-content {
    width:70%;
  }
}
/* Kleinere Anpassungen für sehr kleine Bildschirme */
@media (max-width: 480px) {
  .modal-content {
    padding: 15px;
  }

  .play-button {
    padding: 10px 20px;
    font-size: 0.9em;
  }

  .play-button svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .data-privacy-hint.inside {
    font-size: 0.8em;
  }
}
</style>
