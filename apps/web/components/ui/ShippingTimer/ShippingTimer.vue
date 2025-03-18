<template>
  <div class="border border-neutral-200 rounded-md hover:shadow-lg flex flex-col mt-1">
    <div class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col flex-auto">
      <div v-if="nach14Uhr">
        <p class="text-red-500">{{ $t('orderDeadlineExpired') }}</p>
      </div>
      <div v-else-if="keinBestellTag">
        <p class="text-yellow-500">{{ $t('noOrderToday') }}</p>
      </div>
      <div v-else>
        <p>
          Lieferung am {{ zielDatum.toLocaleDateString() }} bei einer Bestellung bis {{ zielBestellZeitStunde }} Uhr
        </p>
        <p>
          Der Versand erfolgt heute wenn Sie innerhalb der nächsten {{ stunden }}:{{ minuten }} bestellen.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const zielBestellZeitStunde = 14;
const zielBestellZeitMinute = 0;
const lieferZeitTage = 2;

const zielDatum = ref(new Date());
const tage = ref(0);
const stunden = ref(0);
const minuten = ref(0);
const sekunden = ref(0);
const nach14Uhr = ref(false);
const keinBestellTag = ref(false);
const intervalId = ref<ReturnType<typeof setInterval> | number>(0);

function berechneZielDatum(): Date {
  const jetzt = new Date();
  let zielDatum = new Date(jetzt);
  // Zielzeit auf 14:00 Uhr setzen
  zielDatum.setHours(zielBestellZeitStunde, zielBestellZeitMinute, 0, 0);

  //Wenn Freitag ist, wird der Versand auf Montag verschoben.
  if (jetzt.getDay() === 5) {
    zielDatum.setDate(zielDatum.getDate() + 3);
  }

  //Liefertage berechnen.
  let lieferDatum = new Date(zielDatum);
  let lieferTageZaehler = 0;

  while (lieferTageZaehler < lieferZeitTage) {
    lieferDatum.setDate(lieferDatum.getDate() + 1);
    if (lieferDatum.getDay() !== 0) {
      lieferTageZaehler++;
    }
  }
  return lieferDatum;
}

function aktualisiereCountdown() {
  const jetzt = new Date();
  const jetztWochentag = jetzt.getDay();
  const jetztStunde = jetzt.getHours();
  const jetztMinute = jetzt.getMinutes();

  //Prüfe ob Heute ein Werktag ist.
  if (jetztWochentag >= 1 && jetztWochentag <= 4) {
    //Prüfe ob die Bestellzeit eingehalten wird.
    if (jetztStunde < zielBestellZeitStunde || (jetztStunde === zielBestellZeitStunde && jetztMinute < zielBestellZeitMinute)) {
      zielDatum.value = berechneZielDatum();
      const verbleibendeZeit = zielDatum.value.getTime() - jetzt.getTime();

      if (verbleibendeZeit <= 0) {
        nach14Uhr.value = true;
        return;
      }

      tage.value = Math.floor(verbleibendeZeit / (1000 * 60 * 60 * 24));
      stunden.value = Math.floor((verbleibendeZeit % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minuten.value = Math.floor((verbleibendeZeit % (1000 * 60 * 60)) / (1000 * 60));
      sekunden.value = Math.floor((verbleibendeZeit % (1000 * 60)) / 1000);

      nach14Uhr.value = false;
      keinBestellTag.value = false;
    } else {
      nach14Uhr.value = true;
      keinBestellTag.value = false;
    }
  } else {
    keinBestellTag.value = true;
    nach14Uhr.value = false;
  }
}

onMounted(() => {
  aktualisiereCountdown();
  intervalId.value = setInterval(aktualisiereCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId.value);
});
</script>
