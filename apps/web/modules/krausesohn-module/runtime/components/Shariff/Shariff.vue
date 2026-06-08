<template>
  <ClientOnly>
    <div
      class="shariff"
      data-theme="white"
      data-orientation="horizontal"
      data-services="[&quot;facebook&quot;,&quot;pinterest&quot;,&quot;whatsapp&quot;]"
      :data-media-url="mediaUrl"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  mediaUrl: string
}>()

const mediaUrl = computed(() => {
  if (props.mediaUrl.startsWith('http')) {
    return props.mediaUrl
  }

  return `${window.location.origin}${props.mediaUrl}`
})

onMounted(async () => {
  if (!document.querySelector('link[data-shariff]')) {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Shariff/shariff.css'
    css.setAttribute('data-shariff', 'true')

    document.head.appendChild(css)
  }

  if (!(window as any).Shariff) {
    const script = document.createElement('script')
    script.src = 'https://cdn02.plentymarkets.com/d5bn3yt8owq2/frontend/Shariff/shariff.js'
    script.async = true

    document.body.appendChild(script)
  }
})
</script>
