<template>
  <div
    v-if="notificationMessage"
    class="shop-notification bg-primary-500 text-white p-2 text-center text-sm md:text-base relative transition-all duration-500 ease-in-out"
    role="alert"
  >
    <div class="max-w-screen-2xl mx-auto flex items-center justify-between">
      <p class="flex-grow" v-html="notificationMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfiguration } from '~/composables/useSiteConfiguration/useSiteConfiguration';

const { notifyMessage } = useSiteConfiguration();

const displayNotification = ref(false);

const notificationMessage = computed(() => notifyMessage.value || '');
</script>
