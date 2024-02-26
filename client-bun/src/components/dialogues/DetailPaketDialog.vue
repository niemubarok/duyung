<template>
  <q-dialog ref="dialogRef">
    <q-card flat bordered class="q-dialog-plugin glass-light">
      <q-card-section class="row items-center">
        <div class="text-h6">Detail Transaksi</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :rows-per-page-options="[10, 25, 50]"
          :pagination.sync="pagination"
          :rows="transaksiStore().detailDataTransaksi"
          :columns="columns"
          row-key="id"
          virtual-scroll
          style="height: 500px"
          class="my-sticky-header-table"
        >
          <template v-slot:body="props">
            <q-tr :props="{ index, props }">
              <!-- {{ index }}
              <q-td key="no" :props="props">{{ props.row.no }}</q-td> -->
              <q-td key="namaWahana" :props="props">{{ props.row.nama }}</q-td>
              <q-td key="qty" :props="props">{{ props.row.qty }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
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

const columns = [
  // {
  //   name: "no",
  //   required: true,
  //   label: "No.",
  //   align: "left",
  //   field: (row) => row.no,
  //   sortable: true,
  // },
  {
    name: "namaWahana",
    align: "left",
    label: "Nama Wahana",
    field: "namaWahana",
    sortable: true,
  },
  { name: "qty", label: "Qty", field: "qty", sortable: true },
];

const pagination = ref({
  sortBy: "namaWahana",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
</script>
