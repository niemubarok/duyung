<template>
  <q-page padding class="full-width flex flex-center">
    <!-- class="full-width" -->
    <div class="column">
      <!-- :class="$q.platform.is.mobile ? 'q-mb-md' : 'q-pa-md q-mx-md '" -->
      <q-card class="bg-grey-2">
        <q-card-section>
          <q-img
            src="~/assets/logo-dland.png"
            width="300px"
            spinner-color="primary"
            spinner-size="82px"
          />
        </q-card-section>
      </q-card>
      <!-- :class="$q.platform.is.mobile ? '' : 'q-pa-md q-mt-xl'" -->
      <q-card
        class="q-mt-md bg-grey-2"
        :style="
          $q.platform.is.mobile
            ? 'width:100%;height:70vh'
            : 'width:70vw;height:max-content'
        "
      >
        <div class="text-h6 text-center">
          <div class="row items-center flex-center">
            <q-icon name="qr_code_scanner" class="q-mr-sm" />
            SCAN QRCODE
          </div>
        </div>
        <q-separator />

        <div class="text-h6">{{ result }}</div>
        <!-- <q-btn
          push
          :label="$q.platform.is.desktop ? 'rescan' : ''"
          icon="refresh"
          color="grey-8 text-white"
          @click="() => (result = '')"
        /> -->

        <!-- <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
      <q-card-section>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit -->

        <div
          class="q-my-md"
          :style="
            $q.platform.is.desktop
              ? 'width:100%;height:500px'
              : 'width:100%;height:40vh'
          "
        >
          <qrcode-stream
            ref="qrcodeStream"
            v-if="Object.keys(selectedWahana).length !== 0"
            class="rounded-10"
            @detect="onDetect"
            @error="onError"
            :paused="cameraPaused"
          ></qrcode-stream>
          <!-- @camera-on="onReady" -->

          <!-- <div v-if="isCameraReady === false">
            <q-skeleton
              :style="
                $q.platform.is.desktop
                  ? 'width:100%;height:500px'
                  : 'width:100%;height:40vh'
              "
              class="text-center flex flex-center"
            >
              Camera Loading...
            </q-skeleton>
          </div> -->

          <div v-else>
            <q-skeleton
              :style="
                $q.platform.is.desktop
                  ? 'width:100%;height:500px'
                  : 'width:100%;height:40vh'
              "
              class="text-center flex flex-center"
            >
              Silahkan Pilih Wahana terlebih dahulu
            </q-skeleton>
          </div>
        </div>

        <div class="flex row justify-end">
          <div
            class="flex row flex-center items-center full-width bg-grey-4 q-mb-md q-px-md q-py-xs"
          >
            <!-- style="border-radius: 5px" -->
            <q-chip
              v-if="Object.keys(selectedWahana).length !== 0"
              square
              class="bg-grey-5 text-dark"
              label="Wahana:"
            />
            <q-skeleton
              v-if="
                $q.platform.is.desktop &&
                Object.keys(selectedWahana).length === 0
              "
              class="col q-ma-xs q-pa-md"
            />

            <q-chip
              v-if="Object.keys(selectedWahana).length !== 0"
              square
              class="col bg-grey-1 text-dark text-weight-bolder q-py-lg q-px-lg relative"
              :label="selectedWahana.name"
            >
            </q-chip>
            <q-btn
              v-if="$q.platform.is.mobile"
              push
              color="brown"
              size="lg"
              :icon="
                Object.keys(selectedWahana).length === 0
                  ? 'pan_tool_alt'
                  : 'refresh'
              "
              :label="
                Object.keys(selectedWahana).length === 0 ? 'Pilih Wahana' : ''
              "
              style="width: fit-content"
              @click="wahanaDialog = true"
            />
            <!-- class="q-mb-md" -->
            <q-btn
              v-if="$q.platform.is.desktop"
              push
              color="brown"
              size="lg"
              label="Pilih Wahana"
              style="width: fit-content"
              @click="wahanaDialog = true"
            />
            <!-- class="q-mb-md" -->
            <!-- :icon="$q.platform.is.desktop ? '' : 'refresh'" -->
          </div>
          <!-- <div
          class="flex row q-gutter-md flex-center"
          style="overflow-y: auto"
          :style="$q.screen.lt.sm ? { height: '30vh' } : { height: '100%' }"
        > -->
          <!-- <div
            v-for="(wahana, index) in wahanaStore().daftarWahana"
            :key="wahana"
          >
            <q-btn
              class="text-body col"
              color="brown"
              :label="wahana.name"
              @click="selectedWahana = wahana"
              style="width: 150px"
              push
              v-model="selectedWahana"
            />
            <TicketCard />
          </div> -->
          <!-- </div> -->
        </div>
      </q-card>
    </div>
    <!-- <div>
      <q-input v-model="text" type="text" label="Label" />
      <q-btn color="primary" icon="check" label="OK" />
    </div>

    <div>
      <h1>QR Code Viewer</h1>
      <div v-if="qrcode">
        <img :src="qrcode.base64Qr" alt="QR Code" />
      </div>
      <div v-else>
        <p>No QR Code available</p>
      </div>
      <button @click="requestQRCode">Request QR Code</button>
    </div> -->

    <q-dialog v-model="checkMark" full-width full-height @hide="onHide">
      <div class="flex flex-center">
        <q-card
          class="bg-green-5 q-pa-xl fixed-center"
          :class="$q.platform.is.mobile ? 'column' : 'row'"
          :style="
            $q.platform.is.mobile ? 'width:100%' : 'width:50vw;height:40vh'
          "
        >
          <div class="col flex flex-center q-ma-xl q-pr-md">
            <success-check-mark class="q-mr-xl" />
          </div>
          <div
            class="col flex flex-center text-dark text-center q-mt-xl"
            style="font-size: clamp(12px, 2vw, 20px)"
          >
            <q-card class="glass-light q-pa-xs">
              <q-card-section>
                <div class="text-h6">Saldo Berhasil dipotong</div>
              </q-card-section>
              <q-card-section>
                <q-chip
                  class="text-weight-bolder text-h6"
                  :label="'Rp ' + selectedWahana.tarif"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card>
      </div>
    </q-dialog>

    <q-dialog v-model="wahanaDialog" persistent>
      <div class="flex flex-center">
        <!-- :class="$q.platform.is.mobile ? 'column' : 'row'" -->
        <q-card
          class="bg-grey-5 q-pa-sm fixed-center items-center row"
          :style="
            $q.platform.is.mobile ? 'width:100%' : 'width:50vw;height:40vh'
          "
        >
          <div
            v-for="(wahana, index) in wahanaStore().daftarWahana"
            :key="wahana"
          >
            <q-btn
              class="text-body col q-pa-sm q-ma-xs"
              color="brown"
              :label="wahana.name"
              @click="[(selectedWahana = wahana), (wahanaDialog = false)]"
              style="width: 150px"
              push
              v-model="selectedWahana"
            />
            <!-- <TicketCard /> -->
          </div>
        </q-card>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { transaksiStore } from "src/stores/transaksi-store";
import { wahanaStore } from "src/stores/wahana-store";
import { ref, onMounted } from "vue";
import SuccessCheckMark from "src/components/SuccessCheckMark.vue";
import { Howl } from "howler";
import { useQuasar } from "quasar";

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

const $q = useQuasar();
const result = ref("");
const qrcode = ref("");
const text = ref("");
const checkMark = ref(false);
const selectedWahana = ref({});
const wahanaDialog = ref(false);
const cameraPaused = ref(false);
const isCameraReady = ref(false);
const playSuccessNotification = () => {
  const sound = new Howl({
    src: ["src/assets/audio/success_notification.wav"],
  });
  sound.play();
};
const onDetect = (payload) => {
  cameraPaused.value = true;

  if (Object.keys(selectedWahana.value).length !== 0) {
    result.value = payload[0].rawValue;
    playSuccessNotification();
    checkMark.value = true;
    setTimeout(() => {
      checkMark.value = false;
    }, 2000);
  } else {
    $q.notify({
      type: "negative",
      message: "Pilih wahana terlebih dahulu!",
      position: "center",
      timeout: 1000,
    });
    cameraPaused.value = false;
  }
};

const onReady = () => {
  isCameraReady.value = true;
};

const onError = (error) => {
  $q.notify({
    type: "negative",
    message: error,
  });
};

const onHide = () => {
  cameraPaused.value = false;
  result.value = "";
};

onMounted(async () => {});
</script>
