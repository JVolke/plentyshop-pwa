<template>
  <ClientOnly>
    <div
      ref="shariffElement"
      class="shariff"
      data-theme="white"
      data-orientation="horizontal"
      data-services='["facebook","pinterest","whatsapp"]'
      :data-media-url="mediaUrl"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  mediaUrl: string;
}>();

declare global {
  interface Window {
    Shariff?: new (element: HTMLElement) => unknown;
    __shariffScriptLoading?: Promise<void>;
  }
}

const shariffElement = ref<HTMLElement | null>(null);

const mediaUrl = computed(() => {
  if (props.mediaUrl.startsWith('http')) {
    return props.mediaUrl;
  }

  return `${window.location.origin}${props.mediaUrl}`;
});

const loadShariffCss = () => {
  if (!document.querySelector('link[data-shariff]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Shariff/shariff.css';
    css.setAttribute('data-shariff', 'true');

    document.head.appendChild(css);
  }
};

const loadShariffScript = () => {
  if (window.Shariff) return Promise.resolve();
  if (window.__shariffScriptLoading) return window.__shariffScriptLoading;

  window.__shariffScriptLoading = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-shariff]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Shariff script could not be loaded')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Shariff/shariff.js';
    script.async = true;
    script.setAttribute('data-shariff', 'true');
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Shariff script could not be loaded')), { once: true });

    document.body.appendChild(script);
  });

  return window.__shariffScriptLoading;
};

const initializeShariff = async () => {
  await nextTick();

  const element = shariffElement.value;
  if (!element || !window.Shariff) return;

  element.innerHTML = '';
  delete (element as HTMLElement & { shariff?: unknown }).shariff;
  (element as HTMLElement & { shariff?: unknown }).shariff = new window.Shariff(element);
};

onMounted(async () => {
  loadShariffCss();

  await loadShariffScript();
  await initializeShariff();
});

watch(mediaUrl, () => {
  if (!(window as any).Shariff) {
    return;
  }

  void initializeShariff();
});
</script>
