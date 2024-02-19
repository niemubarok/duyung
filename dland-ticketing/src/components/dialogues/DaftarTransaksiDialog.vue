<template>
  <q-dialog ref="dialogRef" full-width>
    <q-card class="q-dialog-plugin bg-white relative full-width q-pt-lg">
      <div>
        <q-avatar
          size="30px"
          class="cursor-pointer z-top absolute-top-right q-ma-sm"
          text-color="grey-2"
          color="brown-6"
          icon="close"
          @click="dialogRef.hide()"
        />
      </div>
      <!-- <q-card-section class="row items-center">
        <div class="text-h6">Daftar Transaksi</div>
      </q-card-section> -->
      <!-- <q-separator /> -->
      <daftar-transaksi />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import DaftarTransaksi from "src/components/reports/DaftarTransaksi.vue";
import { wahanaStore } from "src/stores/wahana-store.js";
import { ref } from "vue";

const { dialogRef, onDialogHide } = useDialogPluginComponent();
const $q = useQuasar();
const props = defineProps({
  type: String,
  url: String,
  component: String,
});

defineEmits([...useDialogPluginComponent.emits]);
</script>
