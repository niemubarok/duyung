<template>
  <q-card
    @contextmenu.prevent="onRightClick"
    class="relative ticket flex column card-gradient hover rounded-10 text-center flex-center q-py-sm cursor-pointer non-selectable"
    :style="
      $q.screen.lt.sm
        ? 'width: 80vw;margin-top: 10px'
        : props.length > 9
        ? 'width: 20vw;height: 15%; margin-top:10px'
        : 'width: 20vw;height: 20%; margin-top:10px;height: 150px;'
    "
  >
    <div @click="onClickQty">
      <q-btn
        push
        color="yellow-5"
        text-color="black"
        :label="qty || 0"
        class="q-pa-sm text-weight-bolder absolute-top-right q-mr-xs q-mt-xs"
        style="font-size: medium"
        :offset="[40, 50]"
      />
    </div>
    <q-card-section @click="onClickWahana">
      <div class="text-subtitle1 text-weight-bolder">
        {{ props.nama }}
      </div>

      <q-separator />
      <div class="text-subtitle1">
        {{
          props.tarif
            .toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })
            .split(",")[0]
        }}
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="qtyDialog" @hide="onHideQtyDialog">
    <q-card class="glass-light q-pa-lg relative">
      <div>
        <q-chip class="text-weight-bolder"> Masukkan Jumlah Tiket </q-chip>
      </div>
      <q-card-section class="row items-center">
        <q-input
          standout="bg-brown-9"
          autofocus
          v-model="qtyModel"
          color="yellow"
          input-class="text-weight-bolder text-h4"
          type="number"
        />
        <!-- label="Masukkan Jumlah tiket" -->
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-sm flex-wrap">
          <template v-for="n in 100" :key="n">
            <q-btn
              push
              v-if="n % 5 === 0"
              class="q-ma-sm bg-white"
              style="width: 50px; height: 50px"
              :label="n.toString()"
              @click="qtyModel = n"
            />
          </template>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div>
          <q-avatar
            size="25px"
            class="cursor-pointer z-top absolute-top-right q-ma-sm"
            text-color="grey-9"
            color="grey-5"
            icon="close"
            v-close-popup
          />
        </div>
        <q-btn
          push
          icon="check"
          color="brown-9"
          v-close-popup
          @click="onClickWahana"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { transaksiStore } from "src/stores/transaksi-store.js";
import { ref, computed } from "vue";

const props = defineProps({
  id: String,
  nama: String,
  tarif: Number,
  diskon: Number,
  total_bayar: Number,
  qty: Number,
  length: Number,
  deskripsi: String,
  jenis: String,
  hari: String,
});

const qtyDialog = ref(false);
const qtyModel = ref();

const onClickQty = () => {
  transaksiStore().isCustomQty = true;
  qtyDialog.value = true;
};

const onHideQtyDialog = () => {
  transaksiStore().isCustomQty = false;
};

const qty = computed(() => {
  return transaksiStore().detailTransaksi.length
    ? transaksiStore().detailTransaksi.find(
        (item) => item.id_wahana === props.id
      )?.qty
    : 0;
});
const onClickWahana = () => {
  const data = ref({
    id_wahana: props.id,
    nama: props.nama,
    tarif: props.tarif,
    diskon: props.diskon,
    total_bayar: props.tarif,
    deskripsi: props.deskripsi,
    jenis: props.jenis,
    hari: props.hari,
  });

  transaksiStore().qty = qtyModel.value;
  transaksiStore().addTransaksi(data.value);

  transaksiStore().detailTransaksi;
};

// onUpdated(() => {
//   qty.value = transaksiStore().qty(props.id);
// });

const onRightClick = () => {
  qty.value > 0 ? qty.value-- : qty.value;
  transaksiStore().decreaseQty(props.id);
};
</script>

<style>
.ticket {
  position: relative;
  box-sizing: border-box;
  /* width: 300px; */
  /* height: 750px; */
  /* margin: 150px auto 0; */
  padding: 20px;
  border-radius: 10px;
  /* background: #fbfbfb; */
  /* box-shadow: 2px 2px 15px 0px #ab9b0d; */

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 10px;
    /* right: 5px; */
    height: 6px;
    width: 91%;
  }

  &:before {
    top: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        #fbfbfb 50%,
        #fbfbfb 100%
      ) -7px -8px / 16px 16px repeat-x;
  }

  &:after {
    bottom: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        #fbfbfb 50%,
        #fbfbfb 100%
      ) -7px -2px / 16px 16px repeat-x;
  }
}

.ticket__content {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border: 6px solid #d8d8d8;
}

.ticket__text {
  width: 400px;
  font-family: "Helvetica", "Arial", sans-serif;
  font-size: 0.5rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #c6dede;
  transform: translate(-25px, 25px) rotate(-55deg);
}
</style>
