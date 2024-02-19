<template>
  <q-page padding>
    <TopPanel height="10vh" class="q-mb-md bg-grey-9 rounded-10" />

    <!-- :ratio="16 / 9" -->
    <div class="flex row flex-center items-center" style="height: 70vh">
      <!-- :class="$q.platform.is.mobile ? 'full-width' : 'col-8'" -->
      <!-- <q-img
        src="~/assets/logo-dland.png"
        width="400px"
        spinner-color="primary"
        spinner-size="82px"
      /> -->
      <q-card
        :class="$q.platform.is.mobile ? 'full-width' : 'col-10'"
        class="column rounded-10"
      >
        <!-- <q-card-section> -->
        <q-card class="glass-dark">
          <q-tabs
            v-model="tab"
            dense
            class="text-dark"
            active-color="white"
            active-bg-color="secondary"
            indicator-color="orange"
            align="justify"
          >
            <!-- narrow-indicator -->
            <q-tab name="generate" label="Buat QR" class="q-py-md" />
            <q-tab name="scan" label="Scan QR" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated swipeable style="height: 60vh">
            <q-tab-panel name="generate">
              <q-input
                class="input-box rounded-10 relative text-uppercase q-pa-md"
                :class="'bg-secondary text-white'"
                :input-class="'input-box text-white text-weight-bolder'"
                input-style="height:10vh;border:0"
                label-color="yellow  q-pb-xl"
                :label-color="
                  $q.platform.is.mobile ? 'text-subtitle2' : ' text-h4 '
                "
                :color="'bg-yellow'"
                item-aligned
                borderless
                v-model="transaksiStore().no_whatsapp"
                label="Masukkan Nomor Whatsapp"
                ref="inputNoWaRef"
                autofocus
                :rules="[
                  (val) =>
                    val
                      ? transaksiStore().no_whatsapp.length > 11 ||
                        'Nomor masih kurang'
                      : true,
                ]"
                @keydown.enter.prevent="inputSaldoRef.focus()"
              >
                <!-- @update:model-value="() => onInputPlatNomor()" -->
                <!-- <template v-slot:prepend>
                  <q-btn
                    v-if="$q.platform.is.desktop"
                    push
                    label="F1"
                    class="bg-white text-weight-bold q-mt-md q-mr-md"
                  />
                </template>

                <template v-slot:append>
                  <q-btn
                    v-if="$q.platform.is.desktop"
                    push
                    :size="'xl'"
                    class="q-mt-md bg-white"
                    icon="keyboard_return"
                  />
                </template> -->
              </q-input>

              <div class="q-mt-md">
                <q-input
                  class="input-box rounded-10 relative text-uppercase q-pa-md"
                  :class="'bg-purple-10 text-white'"
                  :input-class="'input-box text-white text-weight-bolder'"
                  input-style="height:10vh;border:0"
                  label-color="yellow  q-pb-xl"
                  :label-color="
                    $q.platform.is.mobile ? 'text-subtitle2' : ' text-h4 '
                  "
                  :color="'bg-yellow'"
                  item-aligned
                  borderless
                  v-model="transaksiStore().saldo"
                  label="Masukkan Saldo"
                  ref="inputSaldoRef"
                  :rules="[
                    (val) =>
                      val
                        ? transaksiStore().saldo * 0 === 0 || 'Masukkan angka'
                        : true,
                  ]"
                >
                  <!-- @keydown.enter="onEnter" -->
                  <!-- <template v-slot="error">
                    <div class="text-red">{{ error }}</div>
                  </template> -->
                  <!-- @update:model-value="() => onInputPlatNomor()" -->
                  <!-- <template v-slot:prepend>
                    <q-btn
                      v-if="$q.platform.is.desktop"
                      push
                      label="F2"
                      class="bg-white text-weight-bold q-mt-md q-mr-md"
                    />
                  </template>

                  <template v-slot:append>
                    <q-btn
                      push
                      :size="$q.platform.is.mobile ? 'md' : 'xl'"
                      class="q-mt-md bg-white"
                      icon="keyboard_return"
                      @click="onEnter"
                    />
                  </template> -->
                </q-input>
              </div>

              <div class="full-width flex q-mt-md">
                <q-btn
                  push
                  color="primary"
                  style="width: 80px"
                  :class="
                    $q.platform.is.mobile
                      ? 'col-4 q-mx-sm q-mt-xs'
                      : 'col q-mx-sm'
                  "
                  label="25.000"
                  @click="transaksiStore().saldo = 25000"
                />
                <q-btn
                  push
                  color="primary"
                  style="width: 80px"
                  :class="
                    $q.platform.is.mobile
                      ? 'col-4 q-mx-sm q-mt-xs'
                      : 'col q-mx-sm'
                  "
                  label="50.000"
                  @click="transaksiStore().saldo = 50000"
                />
                <q-btn
                  push
                  color="primary"
                  style="width: 80px"
                  :class="
                    $q.platform.is.mobile
                      ? 'col-4 q-mx-sm q-mt-xs'
                      : 'col q-mx-sm'
                  "
                  label="100.000"
                  @click="transaksiStore().saldo = 100000"
                />
                <q-btn
                  push
                  color="primary"
                  style="width: 80px"
                  :class="
                    $q.platform.is.mobile
                      ? 'col-4 q-mx-sm q-mt-xs'
                      : 'col q-mx-sm'
                  "
                  label="125.000"
                  @click="transaksiStore().saldo = 125000"
                />
                <q-btn
                  push
                  color="primary"
                  style="width: 80px"
                  :class="
                    $q.platform.is.mobile
                      ? 'col-4 q-mx-sm q-mt-xs'
                      : 'col q-mx-sm'
                  "
                  label="150.000"
                  @click="transaksiStore().saldo = 150000"
                />
                <q-btn
                  push
                  color="primary"
                  style="width: 80px"
                  :class="
                    $q.platform.is.mobile
                      ? 'col-4 q-mx-sm q-mt-xs'
                      : 'col q-mx-sm'
                  "
                  label="200.000"
                  @click="transaksiStore().saldo = 200000"
                />
              </div>

              <div class="row q-mt-lg">
                <!-- <q-btn
                  class="col q-ma-md q-py-md"
                  push
                  color="brown-8"
                  icon="print"
                  label="Cetak"
                  @click="onClick"
                /> -->
                <q-btn
                  class="col q-ma-md q-py-md"
                  push
                  color="secondary"
                  icon="qr_code"
                  label="Generate"
                  @click="onGenerate"
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="scan">
              <div
                class="flex flex-center items-center full-width"
                v-if="result == ''"
              >
                <div class="text-h6">
                  <qrcode-stream
                    :style="
                      $q.platform.is.mobile
                        ? 'width: 100%; height: 50vh'
                        : 'width: 600px; height: 500px'
                    "
                    v-if="result == ''"
                    class="rounded-10"
                    @detect="onDetect"
                  ></qrcode-stream>
                </div>
              </div>

              <div v-if="result">
                <!-- icon="directions" -->
                <q-input filled class="text-h5 q-mb-md" v-model="result">
                  <template #prepend>
                    <q-chip
                      v-if="$q.platform.is.desktop"
                      square
                      label="result"
                      color="grey-8 text-white"
                    />
                  </template>
                  <template #append>
                    <q-btn
                      push
                      :label="$q.platform.is.desktop ? 'rescan' : ''"
                      icon="refresh"
                      color="grey-8 text-white"
                      @click="() => (result = '')"
                    />
                  </template>
                </q-input>

                <q-input
                  class="input-box rounded-10 relative text-uppercase q-pa-md"
                  :class="'bg-secondary text-white'"
                  :input-class="'input-box text-white text-weight-bolder'"
                  input-style="height:10vh;border:0"
                  label-color="yellow  q-pb-xl"
                  :label-color="
                    $q.platform.is.mobile ? 'text-subtitle2' : ' text-h2 '
                  "
                  :color="'bg-yellow'"
                  item-aligned
                  borderless
                  v-model="transaksiStore().no_whatsapp"
                  label="Masukkan Saldo"
                  ref="inputNoWaRef"
                  autofocus
                  :rules="[
                    (val) =>
                      val
                        ? transaksiStore().no_whatsapp.length <= 11 ||
                          'Nomor masih kurang'
                        : true,
                  ]"
                  @keydown.enter="onEnter"
                >
                  <!-- @update:model-value="() => onInputPlatNomor()" -->
                  <!-- <template v-slot:prepend>
                  <q-btn
                    v-if="$q.platform.is.desktop"
                    push
                    label="F1"
                    class="bg-white text-weight-bold q-mt-md q-mr-md"
                  />
                </template>

                <template v-slot:append>
                  <q-btn
                    v-if="$q.platform.is.desktop"
                    push
                    :size="'xl'"
                    class="q-mt-md bg-white"
                    icon="keyboard_return"
                  />
                </template> -->
                </q-input>
              </div>
              <div v-if="result" class="row q-mt-lg">
                <!-- <q-btn
                  class="col q-ma-md q-py-md"
                  push
                  color="brown-8"
                  icon="print"
                  label="Cetak"
                  @click="onClick"
                /> -->
                <q-btn
                  class="col q-ma-md q-py-md"
                  push
                  color="teal-8"
                  icon="upload"
                  label="Top Up"
                  @click="onClick"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
        <!-- <button @click="requestQRCode">Request QR Code</button> -->
        <!-- </q-card-section> -->
      </q-card>
    </div>

    <q-dialog v-model="qrCodeDialog" persistent>
      <q-card
        class="relative q-pa-xl"
        :style="$q.platform.is.mobile ? '' : '80vw'"
      >
        <div
          class="absolute-top-right cursor-pointer"
          @click="qrCodeDialog = false"
        >
          <q-avatar
            size="50px"
            font-size="20px"
            text-color="grey-8"
            icon="close"
            class="bg-transparent"
          />
          <!-- color="grey-3" -->
        </div>
        <!-- <q-avatar icon="close" color="primary" text-color="white" /> -->
        <q-card-section class="row items-center">
          <!-- :ratio="16/9" -->
          <q-img
            :src="qrCode.value"
            width="100%"
            spinner-color="primary"
            spinner-size="82px"
          />
        </q-card-section>
        <q-card-actions align="right">
          <div class="row q-mt-lg">
            <q-btn
              class="col q-ma-md q-py-md"
              push
              color="brown-8"
              icon="print"
              label="Cetak"
            />
            <!-- @click="onClick" -->
            <q-btn
              class="col q-ma-md q-py-md"
              push
              color="secondary"
              icon="chat"
              label="Kirim"
              @click="sendQr"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="fa fa-whatsapp" color="accent" @click="loginWhatsapp" />
      <!-- <font-awesome-icon :icon="['fab', 'whatsapp']" /> -->
    </q-page-sticky>

    <q-dialog v-model="waQrCodeDialog">
      <q-card>
        <q-card-section class="column items-center">
          <h5>Scan QR Code dengan whatsapp</h5>
          <div v-if="waQrCode">
            <img :src="waQrCode.base64Qr" alt="QR Code" />
          </div>
          <div v-else>
            <q-skeleton class="full-width q-pa-md">
              <p>waiting for qrcode...</p>
            </q-skeleton>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { transaksiStore } from "src/stores/transaksi-store";
import { onMounted, ref } from "vue";
import TopPanel from "src/components/TopPanel.vue";
import {
  sendPicture,
  sendMessage,
  listen,
  addSession,
  socket,
} from "src/services/wa-service.js";
import { useQRCode } from "@vueuse/integrations/useQRCode";

import io from "socket.io-client";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

const result = ref("");
const qrCodeDialog = ref(false);

const onDetect = (payload) => {
  console.log(payload);
  result.value = payload[0].rawValue;
};
import { useQuasar } from "quasar";
// import { useComponentStore } from "src/stores/component-store";
const $q = useQuasar();
// const componentStore = useComponentStore();
// const inputNoWaRef = ref(null);
const inputSaldoRef = ref(null);
// const inputPlatNomorRef = ref(null);

// const now = new Date().getUTCMilliseconds();

const tab = ref("generate");
const qrCode = ref("");
// console.log(qrCode.value);
const waQrCode = ref("");
const test = ref("---");
const onGenerate = async () => {
  // const randomText = [...Array(30)]
  //   .map(() => Math.random().toString(36)[2])
  //   .join("");
  // sendMessage();
  const qr = await useQRCode(transaksiStore().no_whatsapp);
  // console.log(qr.value);
  // console.log(test.value);
  qrCode.value = qr;

  qrCodeDialog.value = true;
};

const sendQr = () => {
  // console.log(qrCode.value.value);
  sendPicture(
    qrCode.value.value,
    "6285711525459",
    `Berikut adalah tiket qrcode anda dengan jumlah saldo Rp. ${
      transaksiStore().saldo
    } \n Silahkan tunjukan qrcode anda ke petugas.\nTerimakasih sudah berkunjung ke D'land `
  );

  qrCodeDialog.value = false;
};

const waQrCodeDialog = ref(false);
const sessionName = ref("6285524914191");
const isAuthenticated = ref(false);
const waitingForQrCode = ref(true);

const loginWhatsapp = () => {
  waQrCodeDialog.value = true;
  waQrCode.value = null; // Ensure waQrCode is null before receiving response from server
  socket.emit("requestQRCode", { sessionName: sessionName.value });

  // listen(`authenticated_${sessionName}`).then((data) => {
  //   isAuthenticated.value = true;
  //   waQrCodeDialog.value = false;
  // });
};

const onEnter = async () => {
  // console.log(now);
  // sendPicture(qr.value, "6285711525459");
  // console.log(await listen("messageSent_default"));
  // sendMessage("6285524914191", "tes", "tes");
};
const handleKeyDown = (event) => {
  // console.log(event.key);
  // if (componentStore.currentPage == "outgate") {
  if (event.key === "F1") {
    event.preventDefault();
    inputPlatNomorRef.value.focus();
  }
  //  else if (event.key === "F4") {
  //   event.preventDefault();
  //   onClickKendaraanKeluar();
  // } else if (event.shiftKey === true && event.key === "R") {
  //   event.preventDefault();
  //   onClickKendaraanKeluar();
  // } else if (event.shiftKey === true && event.key === "L") {
  //   event.preventDefault();
  //   logout();
  //   window.location.replace("/");
  // } else if (event.shiftKey === true && event.key === "D") {
  //   event.preventDefault();
  //   darkMode.value = !darkMode.value;
  //   darkModeToggle();
  // } else if (event.key === "F12") {
  //   event.preventDefault();
  //   onClickBukaManual();
  // }
  // }
};

const connectSocket = () => {
  socket = io("http://localhost:8000"); // Sesuaikan dengan URL server Anda
  socket.on("connect", () => {
    console.log("Socket connected");
  });
};

// const sendMessage = () => {};
// const requestQRCode = () => {
//   addSession("6285524914191");
// };

onMounted(async () => {
  socket.on(`sentImage_${sessionName.value}`, (data) => {
    console.log(data);

    $q.notify({
      type: "success",
      message: "Gambar berhasil dikirim",
    });
  });

  socket.on(`qrCode_${sessionName.value}`, (data) => {
    if (data) {
      waQrCode.value = data;
      console.log(data);
    }
  });
  socket.on(`qrRequest_${sessionName.value}`, (data) => {
    console.log(data.status);
  });
  socket.on(`authenticated_${sessionName.value}`, (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  // document.addEventListener("keydown", handleKeyDown);
  // connectSocket();
  // socket.on(`qrCode_${sessionName}`, (data) => {
  //   console.log(data);
  //   waQrCode.value = data;
  // });
  // socket.on(`qrRequest_${sessionName}`, (data) => {
  //   console.log(data.status);
  // });
  // socket.on(`authenticated_${sessionName}`, (data) => {
  //   console.log(data);
  // });
  // socket.on("disconnect", () => {
  //   console.log("Disconnected from server");
  // });
});
</script>

<style scoped>
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__append .q-field__marginal) {
  height: 10vh;
  width: 100%;
  padding-top: 10px;
  font-size: clamp(0.5rem, 20vw, 2.5rem);
  font-family: "Courier New", Courier, monospace;
}
</style>
