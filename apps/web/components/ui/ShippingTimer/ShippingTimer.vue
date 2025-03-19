<template>
  <div class="border border-primary-200 rounded-md hover:shadow-lg flex flex-col mt-2">
    <div class="p-2  typography-text-sm flex flex-col flex-auto">
      <div>
        <p>
          Lieferung am {{ zielDatum.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
          bei einer Bestellung innerhalb der nächsten {{ countdownText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

const zielBestellZeitStunde = 14;
const zielBestellZeitMinute = 0;
const lieferZeitTage = 2;

const zielDatum = ref(new Date());
const countdownText = ref('');
const keinVersandTag = ref(false);
const naechsterVersandTag = ref(new Date());
const intervalId = ref<ReturnType<typeof setInterval> | number>(0);

// Feiertagsliste (Beispiel)
const feiertage = ref([
  new Date(2025, 0, 1), // Neujahr
  new Date(2025, 3, 18), // Karfreitag
  new Date(2025, 3, 21), // Ostermontag
  new Date(2025, 4, 1), // Tag der Arbeit
  new Date(2025, 4, 29), // Himmelfahrt
  new Date(2025, 5, 9), // Pfingstmontag
  new Date(2025, 9, 3), // Tag der Einheit
  new Date(2025, 9, 31), // Reformationstag
  new Date(2025, 10, 19), // Buß- und Bettag
  new Date(2025, 11, 25), // 1. Weihnachtstag
  new Date(2025, 11, 26), // 2. Weihnachtstag
]);

function istFeiertag(datum: Date): boolean {
  return feiertage.value.some(feiertag =>
    feiertag.getDate() === datum.getDate() &&
    feiertag.getMonth() === datum.getMonth() &&
    feiertag.getFullYear() === datum.getFullYear()
  );
}

function berechneZielDatum(startDatum: Date, tageHinzufügen: number): Date {
  let lieferDatum = new Date(startDatum);
  let lieferTageZaehler = 0;

  while (lieferTageZaehler < tageHinzufügen) {
    lieferDatum.setDate(lieferDatum.getDate() + 1);
    if (lieferDatum.getDay() !== 0 && !istFeiertag(lieferDatum)) {
      lieferTageZaehler++;
    }
  }

  //Feiertage nach der eigentlichen Berechnung auch berücksichtigen.
  while (!istVersandTag(lieferDatum)) {
    lieferDatum.setDate(lieferDatum.getDate() + 1);
  }

  return lieferDatum;
}

function berechneNaechstenVersandTag(datum: Date): Date {
  let naechsterVersandTag = new Date(datum);
  while (!istVersandTag(naechsterVersandTag)) {
    naechsterVersandTag.setDate(naechsterVersandTag.getDate() + 1);
  }
  return naechsterVersandTag;
}

function istVersandTag(datum: Date): boolean {
  return datum.getDay() !== 0 && !istFeiertag(datum);
}

function aktualisiereCountdown() {
  let jetzt = new Date();

  naechsterVersandTag.value = berechneNaechstenVersandTag(jetzt);

  if (istVersandTag(jetzt)) {
    keinVersandTag.value = false;
    let jetztStunde = jetzt.getHours();
    let jetztMinute = jetzt.getMinutes();

    if (jetztStunde < zielBestellZeitStunde || (jetztStunde === zielBestellZeitStunde && jetztMinute < zielBestellZeitMinute)) {
      zielDatum.value = berechneZielDatum(jetzt, lieferZeitTage);
      countdownText.value = `bis ${zielBestellZeitStunde}:${zielBestellZeitMinute} Uhr`;
    } else {
      let naechsterTag = new Date(jetzt);
      naechsterTag.setDate(jetzt.getDate() + 1);
      naechsterTag = berechneNaechstenVersandTag(naechsterTag);
      let naechsterVersandStart = berechneNaechstenVersandTag(new Date(jetzt));
      zielDatum.value = berechneZielDatum(naechsterVersandStart, lieferZeitTage);

      const naechsterTag14Uhr = new Date(jetzt);
      naechsterTag14Uhr.setDate(jetzt.getDate() + 1);
      naechsterTag14Uhr.setHours(zielBestellZeitStunde, zielBestellZeitMinute, 0, 0);

      const verbleibendeZeit = naechsterTag14Uhr.getTime() - jetzt.getTime();
      const stunden = Math.floor(verbleibendeZeit / (1000 * 60 * 60));
      const minuten = Math.floor((verbleibendeZeit % (1000 * 60 * 60)) / (1000 * 60));

      countdownText.value = `${stunden}:${minuten < 10 ? '0' : ''}${minuten} Stunden`;
    }
  } else {
    keinVersandTag.value = true;

    let naechsterVersandStart = berechneNaechstenVersandTag(new Date(jetzt));
    zielDatum.value = berechneZielDatum(naechsterVersandStart, lieferZeitTage)

    const naechsterVersandTag14Uhr = new Date(naechsterVersandTag.value);
    naechsterVersandTag14Uhr.setHours(zielBestellZeitStunde, zielBestellZeitMinute, 0, 0);

    const verbleibendeZeit = naechsterVersandTag14Uhr.getTime() - jetzt.getTime();
    const stunden = Math.floor(verbleibendeZeit / (1000 * 60 * 60));
    const minuten = Math.floor((verbleibendeZeit % (1000 * 60 * 60)) / (1000 * 60));

    countdownText.value = `${stunden}:${minuten < 10 ? '0' : ''}${minuten} Stunden`;
  }
}

onMounted(() => {
  aktualisiereCountdown();
  intervalId.value = setInterval(aktualisiereCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId.value as number);
});
</script>
