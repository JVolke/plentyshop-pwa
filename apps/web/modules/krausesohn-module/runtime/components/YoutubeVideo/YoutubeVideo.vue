<template>
  <div class="video-embed max-w-[560px] w-full">
    <!-- Vorschau OHNE externe Requests -->
    <div
      v-if="requireClickToPlay && !playVideo"
      class="video-preview group"
      @click="loadAndPlayVideo"
    >
      <!-- Lokaler Background -->
      <div class="preview-bg">
        <!-- optional: eigenes Bild -->
        <!-- <img src="/images/video-placeholder.jpg" /> -->
      </div>

      <!-- Overlay -->
      <div class="overlay"></div>

      <!-- Play Button -->
      <div class="play-icon">
        <h1 class="text-white text-center mr-2">Produktvideo</h1>
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </div>

      <!-- Optionaler Text -->
      <div class="preview-text">
        Hinweis: Beim Abspielen werden Daten an YouTube übertragen.
      </div>
    </div>

    <!-- Erst nach Klick -->
    <div v-else class="video-container aspect-video w-full">
      <iframe
        class="w-full h-full"
        :src="videoUrl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>

  </div>
</template>

<script setup lang="ts">
interface Props {
  videoUrl: string;
  requireClickToPlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  requireClickToPlay: true,
});

const playVideo = ref(false);

const loadAndPlayVideo = () => {
  playVideo.value = true;
};
</script>
<style>
.video-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

/* Hintergrund (kein externer Call!) */
.preview-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0b0f1a, #1a1f2e);
}

/* Overlay */
.video-preview .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  transition: background 0.3s ease;
}

.video-preview:hover .overlay {
  background: rgba(0, 0, 0, 0.6);
}

/* Play Button */
.play-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon svg {
  width: 70px;
  height: 70px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 9999px;
  padding: 16px;
  transition: all 0.2s ease;
}

/* Hover Effekt */
.video-preview:hover .play-icon svg {
  transform: scale(1.1);
  background: rgba(255, 0, 0, 0.8);
}

/* Text unten */
.preview-text {
  position: absolute;
  bottom: 10px;
  left: 12px;
  color: white;
  font-size: 14px;
  opacity: 0.9;
}
</style>
