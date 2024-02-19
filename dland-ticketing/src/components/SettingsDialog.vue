<template>
  <q-dialog ref="dialogRef" maximized @hide="onDialogHide" persistent>
    <div class="row justify-center items-center">
      <q-card
        class="q-px-md q-pt-sm q-pb-md glass relative"
        style="width: 90vw; height: fit-content"
      >
        <div v-if="props.closeButton">
          <q-avatar
            size="40px"
            class="cursor-pointer z-top absolute-top-right q-ma-sm"
            text-color="grey-7"
            color="grey-5"
            icon="close"
            @click="dialogRef.hide()"
          />
        </div>
        <!-- <q-icon name="close" /> -->
        <q-item>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              style="margin-left: -20px"
              class="q-mt-xs text-weight-bolder"
              >Pengaturan</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-separator inset />

        <div class="q-mt-md">
          <q-item class="glass">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="print" />
            </q-item-section>
            <q-item-section>
              <q-input v-model="selectedPrinter" label="Masukan nama printer" />
            </q-item-section>
          </q-item>
          <q-item class="glass q-mt-md">
            <q-item-section avatar>
              <q-avatar color="brown-9" text-color="white" icon="link" />
            </q-item-section>
            <q-item-section>
              <!-- <q-select
              filled
              v-model="selectedPrinter"
              :options="printers"
              label="Printer"
              emit-value
              map-options
            /> -->
              <q-input v-model="apiUrl" label="APIURL" />
            </q-item-section>
            <!-- <q-item-section side>
            <q-btn
              push
              text-color="white"
              style="width: 60px"
              color="black"
              @click="getPrinters()"
            ></q-btn> -->
            <!-- <q-icon name="star" color="yellow" /> -->
            <!-- </q-item-section> -->
          </q-item>
        </div>

        <q-card-actions align="right">
          <q-btn
            push
            text-color="primary"
            color="white"
            label="Simpan"
            style="padding: 2rem 1rem"
            class="q-mt-lg q-pa-md text-h6 rounded-corner"
            @click="onSaveSettings"
          >
            <!-- <q-btn push color="black" class="q-ma-md" @click="onSaveSettings" -->
            <!-- /> -->
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { settingsStore } from "src/stores/settings-store";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import {
  onMounted,
  computed,
  onBeforeMount,
  ref,
  onUpdated,
  onUnmounted,
} from "vue";
// import LoginDialog from "src/components/LoginDialog.vue";

import ls from "localstorage-slim";
const printers = ref([]);
const selectedPrinter = ref(ls.get("namaPrinter"));
const apiUrl = ref(ls.get("APIURL"));

const props = defineProps({
  closeButton: Boolean,
});

// ls.config.encrypt = false;
const getPrinters = async () => {};

const $q = useQuasar();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef } = useDialogPluginComponent();

const onSaveSettings = () => {
  // dialogRef.value.hide();
  ls.set("namaPrinter", selectedPrinter.value);
  ls.set("APIURL", apiUrl.value);
  window.location.reload();
};

const handleKeyDownOnSettingDialog = async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    onSaveSettings();
  }
};

onMounted(async () => {
  // window.addEventListener("keydown", handleKeyDownOnSettingDialog);
  // printers.value = await window.electron.getPrinters();
  // console.log(getPrinters);
  // const listPrinter = getPrinters.forEach((each) => {
  //   return each.printer;
  // });
  // printers.value = listPrinter;
});

const onDialogHide = () => {
  if (!ls.get("APIURL") || !ls.get("namaPrinter")) {
    dialogRef.value.show();
  }
};

// else if (transaksiStore.API_URL === "-") {
//   dialogRef.value.show();
//   $q.notify({
//     type: "negative",
//     message: "Silahkan Isi URL API terlebih dahulu",
//     position: "center",
//   });
// }
// };

// const isSubOpen = ref(false);
</script>

<style scoped>
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.378);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
}

:deep(.q-dialog__backdrop.fixed-full) {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(30px);
}
</style>
