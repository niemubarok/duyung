<template>
  <q-card class="col-md-4 glass-light q-ma-xs relative">
    <!-- style="height: 75vh;" -->
    <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
    <!-- <q-card-section> -->
    <div class="text-h6 text-white bg-brown-8">
      Detail Transaksi
      <!-- flat -->
      <q-btn
        push
        dense
        color="white"
        text-color="brown-8"
        icon="view_list"
        class="absolute-top-right q-ma-xs"
        @click="onClickDaftarTransaksi"
      >
        <q-tooltip class="bg-brown-8 text-yellow-7">
          Daftar Transaksi
        </q-tooltip>
      </q-btn>
    </div>
    <q-separator dark />
    <!-- <div class="text-subtitle2">by John Doe</div> -->
    <!-- </q-card-section> -->
    <!-- <q-card-section style="overflow-y: auto"> -->
    <!-- :style="$q.screen.lt.sm ? 'height: 30vh' : 'height: 75vh;'" -->
    <!-- <template v-for="data in transaksiStore().detailTransaksi" :key="data"> -->

    <q-item class="glass-dark">
      <q-item-section>
        <div class="row no-wrap items-center text-white text-weight-bolder">
          <div class="col-5 text-left">Nama Wahana</div>
          <div class="col-1 text-center">Qty</div>
          <div class="col-5 text-center">Tarif</div>
          <div
            class="col-1 text-right cursor-pointer q-pr-xs"
            @click="transaksiStore().resetTransaksi()"
          >
            <q-icon name="delete" color="red" />
          </div>
        </div>
      </q-item-section>
    </q-item>

    <q-virtual-scroll
      type="table"
      style="height: 50vh"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="transaksiStore().detailTransaksi"
      class="glass-light"
    >
      <template v-slot="{ item: row, index }">
        <tr :key="index">
          <td align="left">
            <span class="text-subtitle2">{{ row.nama }}</span>
          </td>
          <td align="left">
            <span class="text-center text-subtitle2">{{ row.qty }}</span>
          </td>
          <td align="right">
            <span class="text-subtitle2">
              {{
                row.total_bayar
                  .toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                  .split(",")[0]
              }}</span
            >
            <q-badge
              @click="transaksiStore().removeTransaksi(row.id_wahana)"
              text-color="white"
              class="q-ml-md cursor-pointer bg-transparent"
            >
              <q-icon name="delete" color="red" />
            </q-badge>
          </td>
        </tr>
      </template>
    </q-virtual-scroll>
    <div class="flex row justify-between q-px-sm glass-dark">
      <span class="text-h6 text-white"> Total </span>
      <span
        class="text-weight-bolder text-h6 text-white q-mr-sm"
        :style="
          transaksiStore().diskon > 0 ? 'text-decoration:line-through' : ''
        "
        >{{
          totalBayar
            .toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })
            .split(",")[0]
        }}</span
      >
    </div>
    <div class="flex row justify-between q-px-sm glass-dark q-py-sm">
      <span class="text-h6 text-white"> Diskon </span>
      <span class="text-h6 text-white q-mr-sm">{{
        transaksiStore().diskon
      }}</span>
      <!-- ?.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .split(",")[0] -->
    </div>
    <div class="flex row justify-between q-px-sm glass-dark">
      <span class="text-h6 text-white"> Total Bayar </span>
      <span class="text-weight-bolder text-h5 text-white q-mr-sm">{{
        transaksiStore()
          .totalAfterDiskon.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })
          .split(",")[0]
      }}</span>
    </div>

    <!-- </q-card-section> -->
    <q-card-actions align="center">
      <!-- <q-btn
        size="lg"
        push
        :label="'QRIS'"
        class="col bg-brown-9 text-white text-weight-bolder q-mt-sm"
        @click="onClickBayar('qris')"
      /> -->
      <q-btn
        size="lg"
        push
        :label="'Bayar'"
        class="col bg-green-9 text-white text-weight-bolder q-mt-sm"
        @click="onClickBayar('cash')"
        @keydown.enter.prevent="return"
      />
      <!-- <q-btn flat label="Action 2" /> -->
    </q-card-actions>
    <!-- label="Daftar Transaksi" -->
  </q-card>
</template>

<script setup>
import { transaksiStore } from "src/stores/transaksi-store";
import { computed, onMounted, ref, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import DaftarTransaksiDialog from "src/components/dialogues/DaftarTransaksiDialog.vue";
import { userStore } from "src/stores/user-store";
import { wahanaStore } from "src/stores/wahana-store";
import ls from "localstorage-slim";
import { generatePDF } from "src/utils/helpers.js";

const $q = useQuasar();
const totalBayar = computed(() => {
  const total = transaksiStore().detailTransaksi.reduce(
    (a, b) => a + b.total_bayar,
    0
  );
  transaksiStore().totalBayar = total;
  transaksiStore().totalAfterDiskon = total - transaksiStore().diskon;
  return total;
});

const onClickBayar = async (method) => {
  // transaksiStore().bayar();
  // console.log(method == "cash" && !transaksiStore().isShowPaymentDialog);

  if (!transaksiStore().detailTransaksi?.length) {
    $q.notify({
      message: "Pilih wahana terlebih dahulu",
      type: "negative",
      position: "center",
    });
    return;
  }

  if (!transaksiStore().isPaket) {
    console.log(
      "detail transaksi di detailtransaksi:",
      transaksiStore().detailTransaksi
    );
    const store = await transaksiStore().insertIntoDB();

    // namaPaket: "Tiket",

    if (store.isSuccess) {
      const transaksi = transaksiStore();
      const data = {
        transaksi: JSON.stringify(transaksi.detailTransaksi),
        diskon: transaksi.diskon,
        totalAfterDiskon: transaksi.totalAfterDiskon,
        totalBayar: transaksi.totalBayar,
        no_transaksi: transaksi.no_transaksi,
      };

      if (transaksi.no_transaksi !== undefined) {
        console.log("data.transaksi", data.transaksi);
        // await generatePDF(data);

        const namaPrinter = ls.get("namaPrinter");
        await window.electron.createPDFStruk(data, namaPrinter);
        //   "Depok Fantasy Land",
        //   JSON.stringify(data)
        // );
        // window.electron.print(namaPrinter);
        // window.electron.printDirectlyToPrinter(namaPrinter);
        $q.notify({
          message: "Pembayaran Berhasil",
          color: "green",
          position: "top",
        });
      }
      // dialogRef.value.hide();
    } else {
      const existingTransaksiGagal = ls.get("transaksi_gagal") || [];
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
    }

    // const dialog = $q.dialog({
    //   component: PaymentDialog,
    // });
    // dialog.update();
  } else {
    transaksiStore().resetTransaksi();
    transaksiStore().isPaket = false;
  }
  transaksiStore().resetTransaksi();
};

const handleKeyDownOnDetailTransaksi = (event) => {
  // console.log(transaksiStore().isShowPaymentDialog);

  if (
    event.key === "Enter" &&
    !transaksiStore().isShowPaymentDialog &&
    userStore().isLogin
  ) {
    if (totalBayar.value > 0) {
      event.preventDefault();
      onClickBayar("cash");
    } else {
      $q.notify({
        message: "Tidak ada transaksi yang harus dibayar",
        color: "red",
        position: "top",
        icon: "warning",
      });
    }
    // transaksiStore().isShowPaymentDialog = true;
    // const dialog = $q.dialog({
    //   component: PaymentDialog,
    // });

    // dialog.update();
  }
  // if (event.shiftKey === true && event.key === "Escape") {
  //   event.preventDefault();
  //   if (componentStore.isPaymentDialogMounted === false) {
  //     onClosePaymentCard();
  //   }
  //   pressedKeys = "";
  // } else {
  //   // Add the pressed key to the string of pressed keys
  //   pressedKeys += event ?? event.key.toUpperCase();

  //   // Check if the pressed keys match the target keys
  //   // if (pressedKeys === targetKeys) {
  //   //   // Call the function to execute
  //   //   console.log("Buka Manual");
  //   // }

  //   // Reset the pressed keys string if it doesn't match the target keys
  //   if (!targetKeys.startsWith(pressedKeys)) {
  //     pressedKeys = "";
  //   }
  // }
};

const onClickDaftarTransaksi = () => {
  const daftarTransaksiDialog = $q.dialog({
    component: DaftarTransaksiDialog,
    componentProps: {},
  });
  daftarTransaksiDialog.update();
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDownOnDetailTransaksi);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDownOnDetailTransaksi);
});
// const columns = ["Nama", "Qty", "Tarif"];
</script>

<style lang="sass" scoped>
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1
  background: #FFFFFF
  color: #000000

.thead-sticky tr:last-child > *
  top: 0

.tfoot-sticky tr:first-child > *
  bottom: 0
</style>
