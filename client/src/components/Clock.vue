<template>
  <!-- <div> -->
  <!-- <q-card flat class="bg-transparent">
      <q-card-section> -->
  <q-chip class="bg-transparent text-white">
    <span class="text-white text-weight-bolder"> {{ day }}, {{ date }} </span>
  </q-chip>
  <q-chip class="bg-transparent q-mr-md">
    <div class="text-weight-bolder text-white digital-7 text-h6">
      {{ hours }}<span class="text-grey">:</span>{{ minutes
      }}<span class="text-grey">:</span>{{ seconds }}
    </div>
  </q-chip>
  <!-- </q-card-section>
    </q-card> -->
  <!-- {{ dateTime() }} -->
  <!-- </div> -->
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import {
  compareTime,
  getDayName,
  getTime,
  setTime,
} from "src/utils/time-util.js";

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const date = ref("");
const day = ref("");

const setClock = () => {
  day.value = getTime().day;
  date.value = getTime().fullDate;
  hours.value = getTime().hours;
  minutes.value = getTime().minutes;
  seconds.value = getTime().seconds;
};

setInterval(() => setClock(), 1000);

onBeforeUnmount(() => {
  clearInterval();
});
</script>
