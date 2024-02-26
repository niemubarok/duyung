<template>
  <q-card class="my-card">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled v-model="wahana.nama" label="Nama Wahana" />
      <q-input
        filled
        type="textarea"
        v-model="wahana.deskripsi"
        label="Deskripsi Wahana"
      />
      <q-input filled v-model.number="wahana.hargaTiket" label="Harga Tiket" />
      <q-select
        filled
        v-model="wahana.jenis"
        :options="jenisOptions"
        label="Jenis Wahana"
        emit-value
        map-options
      />
      <q-btn label="Submit" type="submit" color="primary" />
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const wahana = ref({
  nama: "",
  deskripsi: "",
  hargaTiket: 0,
  jenis: "",
});

const jenisOptions = [
  "Roller Coaster",
  "Water Ride",
  "Dark Ride",
  // Add more jenis options here
];

function onSubmit() {
  // Handle form submission
  console.log("Form data:", wahana.value);
  // You might want to call an API or a store action to save the data
}
</script>
