<template>
  <q-page padding>
    {{ transaksiStore().daftarTransaksi }}
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { transaksiStore } from "src/stores/transaksi-store";

onMounted(async () => {
  await transaksiStore().getTransaksiFromDB();
});
</script>
