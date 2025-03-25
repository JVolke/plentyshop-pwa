<template>
  <div v-if="!mindestbestellwertErreicht && show" class="text-red-500 mt-4">
    <p>Der Mindestbestellwert von {{ formatiereBetrag(mindestbestellwert) }} {{ waehrung }} wurde noch nicht erreicht.</p>
    <p>Es fehlen noch {{ formatiereBetrag(fehlenderBetrag) }} {{ waehrung }} bis zum Mindestbestellwert.</p>
  </div>
</template>

<script setup lang="ts">
import { shippingProviderGetters } from '@plentymarkets/shop-api';

const { data: cart } = useCart();
const shippingProfileId = shippingProviderGetters.getShippingProfileId(cart.value);

const props = defineProps({
  mindestbestellwert: {
    type: Number,
    required: true,
  },
  aktuellerBestellwert: {
    type: Number,
    required: true,
  },
  waehrung: {
    type: String,
    default: '€', // Standardwährung
  },
  shippingProfile: {
    type: Number,
    default: 11 // Versandprofil zum prüfen für Feuerwerk
  }
});

const show = computed(() => parseInt(shippingProfileId) === props.shippingProfile ); // Prüfe auf Versandprofil

const mindestbestellwertErreicht = computed(() => props.aktuellerBestellwert >= props.mindestbestellwert);
const fehlenderBetrag = computed(() => {
  if (props.aktuellerBestellwert < props.mindestbestellwert) {
    return props.mindestbestellwert - props.aktuellerBestellwert;
  }
  return 0;
});

const formatiereBetrag = (betrag: number) => {
  return betrag.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
