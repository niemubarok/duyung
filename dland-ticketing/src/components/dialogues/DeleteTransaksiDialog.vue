<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">Masukkan Alasan Hapus</div>
        <div class="text-body2">{{ props.no_transaksi }}</div>
        <q-input
          v-model="reportStore().deleteReason"
          :model-value="reportStore().deleteReason"
          hint="Minimal 5 huruf"
          :rules="[(val) => (val && val.length > 5) || 'Minimal 5 huruf']"
          dense
          autofocus
          @keyup.enter="onDelete"
        />
        <!-- @keyup.enter="deleteConfirm" -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Batal" color="negative" v-close-popup />
        <q-btn
          flat
          label="Konfirmasi"
          color="positive"
          :disable="
            !reportStore().deleteReason ||
            reportStore().deleteReason.length <= 5
          "
          @click="onDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { reportStore } from "src/stores/report-store.js";

const { dialogRef, onDialogHide } = useDialogPluginComponent();
const $q = useQuasar();
const props = defineProps({
  no_transaksi: String,
});

const onDelete = () => {
  reportStore().deleteTransaksiFromDB(props.no_transaksi);
  dialogRef.value.hide();
  reportStore().deleteReason = "";
};

defineEmits([...useDialogPluginComponent.emits]);
</script>
