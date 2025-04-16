<template>
  <div class="border border-primary-200 rounded-md hover:shadow-lg flex flex-col mt-2">
    <div class="p-2  typography-text-sm flex flex-col flex-auto">
      <div>
        <p>
          Lieferung {{ zielDatum.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) }} -
          {{ zielDatumEnde.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
          bei einer Bestellung innerhalb der nächsten {{ countdownText }}. <i>Gilt nur für Lieferung innerhalb von Deutschland (Inseln ausgenommen)</i>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

const zielBestellZeitStunde = 14;
const zielBestellZeitMinute = 0;
const lieferZeitTage = 1;

const zielDatum = ref(new Date());
const zielDatumEnde = ref(new Date()); // Neues Enddatum für den Zeitraum
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
  return feiertage.value.some((feiertag) =>
    feiertag.getDate() === datum.getDate() &&
    feiertag.getMonth() === datum.getMonth() &&
    feiertag.getFullYear() === datum.getFullYear()
  );
}

function berechneZielDatum(startDatum: Date, tageHinzufügen: number): Date {
  const lieferDatum = new Date(startDatum);
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
    } else {
      let naechsterTag = berechneNaechstenVersandTag(new Date(jetzt.setDate(jetzt.getDate() + 1)));
      zielDatum.value = berechneZielDatum(naechsterTag, lieferZeitTage);
    }
  } else {
    keinVersandTag.value = true;
    let naechsterVersandStart = berechneNaechstenVersandTag(new Date(jetzt));
    zielDatum.value = berechneZielDatum(naechsterVersandStart, lieferZeitTage);
  }

  // Neues Enddatum für den Lieferzeitraum berechnen
  zielDatumEnde.value = new Date(zielDatum.value);
  zielDatumEnde.value.setDate(zielDatumEnde.value.getDate() + 1);

  // Sicherstellen, dass das Enddatum ein gültiger Versandtag ist
  while (!istVersandTag(zielDatumEnde.value)) {
    zielDatumEnde.value.setDate(zielDatumEnde.value.getDate() + 1);
  }

  // Countdown korrekt berechnen
  const bestellFrist = new Date(jetzt);
  bestellFrist.setHours(zielBestellZeitStunde, zielBestellZeitMinute, 0, 0);

  const verbleibendeZeit = bestellFrist.getTime() - jetzt.getTime();
  const stunden = Math.floor(verbleibendeZeit / (1000 * 60 * 60));
  const minuten = Math.floor((verbleibendeZeit % (1000 * 60 * 60)) / (1000 * 60));

  countdownText.value = `${stunden} Stunden ${minuten < 10 ? '0' : ''}${minuten} Minuten`;
}

onMounted(() => {
  aktualisiereCountdown();
  intervalId.value = setInterval(aktualisiereCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId.value as number);
});
</script>
