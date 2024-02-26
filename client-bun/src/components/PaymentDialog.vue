<template>
  <!-- :maximized="true" -->
  <!-- v-model="componentStore.dialogRef" -->
  <q-dialog
    ref="dialogRef"
    maximized
    transition-hide="scale"
    transition-show="scale"
    class="q-pa-xl"
    :content-css="{ 'background-color': 'rgba(0, 0, 0, 0.9)' }"
    @hide="onDialogHide"
  >
    <!-- <struk-card /> -->
    <div>
      <q-card
        style="width: 70vw; height: fit-content; border-radius: 20px"
        class="fixed-center q-px-md q-pt-xl q-pb-xl glass rounded-corner relative"
      >
        <q-item class="absolute-top-left full-width">
          <q-item-section avatar>
            <q-icon name="payments" size="md" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              style="margin-left: -15px"
              class="q-mt-xs text-white text-h4"
              >Bayar Tiket</q-item-label
            >
          </q-item-section>
        </q-item>
        <div
          class="font-courier flex justify-center absolute-top-right q-mr-md"
        >
          <!-- style="width: 200px" -->
          <q-chip
            class="glass q-my-md rounded-corner text-h4 text-grey-10 justify-center relative"
          >
            <q-badge
              style="top: -10px; left: 20px"
              class="bg-primary absolute-top-left"
              text-color="text-white"
              label="Total Bayar"
            />
            <span class="text-subtitle2 q-pb-md">Rp. </span>
            <span class="text-center text-weight-bolder">
              {{ transaksiStore().totalBayar.toLocaleString("id-ID") }}
            </span>
          </q-chip>
        </div>
        <div class="q-pt-xl">
          <q-input
            borderless
            class="input-box q-mt-xl bg-primary rounded-corner relative q-pa-md"
            input-class="input-box text-white text-weight-bolder"
            label-color="yellow text-h6 q-pa-md"
            color="teal"
            v-model="bayarModel"
            label="Masukkan Jumlah Uang Diterima"
            ref="strukRef"
            autofocus
            @update:model-value="() => onInputChange()"
            @keydown.enter.prevent="onEnter()"
          >
            <template v-slot:prepend>
              <q-chip
                flat
                class="bg-transparent text-white text-h6 text-weight-bolder"
                label="Rp. "
              />
            </template>
            <template v-slot:append>
              <q-btn
                push
                :size="'xl'"
                class="q-mt-xl q-mr-lg bg-white text-dark"
                icon="keyboard_return"
                @click="onEnter()"
              />
            </template>
          </q-input>
        </div>
        <q-slide-transition :duration="200">
          <q-card
            flat
            outline
            v-if="
              parseInt(transaksiStore().bayar) >
              parseInt(transaksiStore().totalBayar)
            "
            class="q-mx-lg glass"
            style="transition: slide 0.5s ease"
          >
            <div class="q-mx-md q-mt-md">Uang Kembali</div>
            <q-separator inset light />
            <div>
              <q-chip
                class="font-courier bg-transparent q-mt-md text-h2 text-weight-bolder relative"
                :label="
                  transaksiStore().hitungKembalian().toLocaleString('id-ID')
                "
              >
                <q-badge
                  style="top: 10px; left: 14px"
                  class="bg-transparent text-dark text-h6 absolute-top-left"
                  text-color="text-white"
                  label="Rp. "
                />
              </q-chip>
            </div>
          </q-card>
        </q-slide-transition>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
// import SuccessCheckMark from "./SuccessCheckMark.vue";
import { onMounted, onBeforeUnmount, onBeforeMount, ref, inject } from "vue";
import { transaksiStore } from "src/stores/transaksi-store";
import { wahanaStore } from "src/stores/wahana-store";
const $q = useQuasar();
import { removeDot } from "src/utils/helpers";

const props = defineProps({
  title: String,
  icon: String,
  type: String,
});

const bayarModel = ref();
// const dialogRef = ref(false);
const onInputChange = () => {
  let value = bayarModel.value.replace(/\D/g, "");
  let numberValue = Number(value);
  value = numberValue.toLocaleString("id-ID");

  bayarModel.value = value;

  transaksiStore().bayar = numberValue;
};
defineEmits([...useDialogPluginComponent.emits]);

// let pressedKeys = "";
// const targetKeys = "TABAROKTA";
const { dialogRef, onDialogOK } = useDialogPluginComponent();

onMounted(() => {
  transaksiStore().bayar = transaksiStore().totalBayar.toLocaleString("id-ID");
  bayarModel.value = transaksiStore().totalBayar.toLocaleString("id-ID");
});

// onMounted(async () => {
// const handleKeyDown = async (event) => {
//   if (event.key === "Enter") {
//     await onEnter();
//   }
//   // Add the pressed key to the string of pressed keys
//   pressedKeys += event.key.toUpperCase();
//   // Check if the pressed keys match the target keys
//   if (pressedKeys === targetKeys) {
//     transaksiStore().$reset();
//   }
//   // Reset the pressed keys string if it doesn't match the target keys
//   if (!targetKeys.startsWith(pressedKeys)) {
//     pressedKeys = "";
//   }
// };
// window.addEventListener("keydown", handleKeyDown);
// });

const onDialogHide = () => {
  transaksiStore().isShowPaymentDialog = false;
};

const onEnter = async () => {
  console.log(transaksiStore().detailTransaksi);
  if (
    removeDot(transaksiStore().bayar) > 0 &&
    removeDot(transaksiStore().bayar) >= removeDot(transaksiStore().totalBayar)
  ) {
    // console.log(transaksiStore().detailTransaksi);
    const data = {
      transaksi: transaksiStore().detailTransaksi,
      diskon: transaksiStore().diskon,
      totalAfterDiskon: transaksiStore().totalAfterDiskon,
      totalBayar: transaksiStore().totalBayar,
      namaPaket:wahanaStore().namaPaketTerpilih
    };
    window.electron.createPDFStruk("Depok Fantasy Land", JSON.stringify(data));
    const store = await transaksiStore().insertIntoDB();
    console.log("store", store);
    if (store) {
      window.electron.print();
      $q.notify({
        message: "Pembayaran Berhasil",
        color: "green",
        position: "top",
      });
      dialogRef.value.hide();
    } else {
      const existingTransaksiGagal = ls.get("transaksi_gagal", []);
      const newTransaksiGagal = transaksiStore().detailTransaksi;
      const combinedTransaksiGagal = [
        ...existingTransaksiGagal,
        ...newTransaksiGagal,
      ];
      ls.set("transaksi_gagal", combinedTransaksiGagal);
      $q.notify({
        message: "Gagal",
        color: "nagative",
        position: "top",
      });
      dialogRef.value.hide();
    }

    transaksiStore().bayar = 0;
    transaksiStore().totalBayar = 0;
    transaksiStore().kembalian = 0;
    transaksiStore().resetTransaksi();
    onDialogOK();
  } else {
    $q.notify({
      type: "negative",
      message: "Pembayaran Masih Kurang !!",
    });
  }
};

// const handleKeyDownOnDialogPayment = (event) => {
//   // console.log(event.key);

//   if (event.key === "Escape") {
//     event.preventDefault();
//     dialogRef.value.hide();
//   }
//   // if (event.shiftKey === true && event.key === "Escape") {
//   //   event.preventDefault();
//   //   if (componentStore.isPaymentDialogMounted === false) {
//   //     onClosePaymentCard();
//   //   }
//   //   pressedKeys = "";
//   // } else {
//   //   // Add the pressed key to the string of pressed keys
//   //   pressedKeys += event ?? event.key.toUpperCase();

//   //   // Check if the pressed keys match the target keys
//   //   // if (pressedKeys === targetKeys) {
//   //   //   // Call the function to execute
//   //   //   console.log("Buka Manual");
//   //   // }

//   //   // Reset the pressed keys string if it doesn't match the target keys
//   //   if (!targetKeys.startsWith(pressedKeys)) {
//   //     pressedKeys = "";
//   //   }
//   // }
// };

// onMounted(() => {
//   window.addEventListener("keydown", handleKeyDownOnDialogPayment);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("keydown", handleKeyDownOnDialogPayment);
// });
</script>

<style scoped>
.font-courier {
  font-family: "Courier New", Courier, monospace;
}
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.253);
  border-radius: 20px;
  border: 1px solid rgba(14, 13, 13, 0.125);
}

:deep(.q-dialog__backdrop.fixed-full) {
  background-color: rgba(0, 0, 0, 0.623);
  backdrop-filter: blur(30px);
}

/* :deep(.input-box .q-field__append), */
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__append .q-field__marginal) {
  height: 10vh;
  width: 80vw;
  font-size: clamp(2rem, 3rem, 3rem);
  font-family: "Courier New", Courier, monospace;
}
</style>
