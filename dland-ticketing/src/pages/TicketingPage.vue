<template>
  <!-- <q-page class="fixed-center full-width"> -->
  <!-- <div
    class="full-width"
    style="overflow-y: hidden"
    :class="{
      'q-mt-md': $q.platform.is.mobile,
      '': $q.platform.is.desktop,
    }"
  >
    <div class="full-width">
      <q-card class="glass-dark flex items-center justify-between">
        <div
          class="text-subtitle2 text-weight-bolder text-white text-start q-px-md"
        >
          <q-btn flat icon="dashboard" @click="$router.push('/dashboard')" />
          Depok Fantasy Land
        </div>
        <div class="text-body text-weight-bolder text-white text-start q-px-md">
          {{ ls.get("petugas")?.nama }}
          <Clock />
        </div>
        <div>
          <q-btn
            flat
            color="white"
            icon="logout"
            label="Log Out"
            @click="onLogOut"
          />
        </div>
      </q-card>
    </div> -->
  <!-- 'q-mt-sm': $q.platform.desktop, -->
  <!-- <div
      class="text-subtitle1 text-weight-bolder text-white text-center glass-dark q-mt-xs"
    >
      DEPOK FANTASY LAND TICKETING SYSTEM
    </div> -->
  <!-- <q-header class="glass-dark q-mt-lg">
      <q-card class="col-md-3 glass-light q-ma-xs">
        <div class="text-subtitle1 q-ma-xs q-ml-md">Detail Pesanan Tiket</div>
        <q-separator inset dark />
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
      </q-card>
    </q-header> -->
  <div class="flex row full-width text-center q-mt-md">
    <DetailTransaksi v-if="$q.screen.gt.sm" />
    <q-card
      flat
      class="col q-ma-xs q-pa-sm glass-light"
      style="height: 89vh; border-top: #5d4037 3px solid"
    >
      <!-- <q-btn
        color="primary"
        icon="check"
        label="OK"
        @click="$router.push('/print')"
      /> -->
      <!-- <div class="text-weight-bolder text-body text-white q-mb-md">
          Daftar Wahana
        </div>
        <q-separator spaced inset dark /> -->

      <DetailTransaksi v-if="$q.screen.lt.sm" />
      <div
        class="flex row q-gutter-md flex-center q-mt-md"
        style="overflow-y: auto"
        :style="$q.screen.lt.sm ? { height: '40vh' } : { height: '76vh' }"
      >
        <div v-for="(wahana, index) in daftarWahana" :key="wahana">
          <WahanaCard
            :id="wahana.id_wahana.toString()"
            :nama="wahana.nama"
            :tarif="parseInt(wahana.harga_tiket)"
            :diskon="parseInt(wahana.diskon)"
            :deskripsi="wahana.deskripsi"
            :hari="wahana.hari"
            :jenis="wahana.nama_jenis"
          />

          <!-- <TicketCard /> -->
        </div>
      </div>
      <div class="full-width flex row flex-center q-mt-md gap-sm">
        <span class="text-dark"> Paket : </span>
        <q-btn
          push
          color="brown-9"
          label="Semua"
          @click="qtyDialog = true"
          class="q-mx-xs"
        />

        <template v-for="paket in daftarPaket" :key="paket.idPaket">
          <!-- :label="paket.namaPaket + ' - ' + paket.hargaPaket" -->
          <q-btn
            push
            color="brown-9"
            class="q-mx-xs q-my-xs"
            @click="pilihPaket(paket)"
          >
            {{ paket.namaPaket }}
            <!-- <span class="text-body2 text-weight-thin">
                ({{ (paket.hargaPaket) }})</span -->
          </q-btn>
        </template>
        <!-- <q-btn
            push
            color="brown-9"
            label="tes print"
            class="q-mx-xs"
            @click="testPrint"
          /> -->
      </div>
    </q-card>
  </div>

  <!-- </q-page> -->
  <!-- </div> -->

  <q-dialog v-model="qtyDialog">
    <q-card class="glass-light q-pa-lg relative">
      <q-card-section class="row items-center">
        <q-input
          autofocus
          v-model="qty"
          color="yellow"
          type="number"
          label="Masukkan Jumlah tiket"
        />
        <!-- @keydown.enter.prevent="selectAllWahana" -->
      </q-card-section>
      <q-card-actions align="right">
        <div>
          <q-avatar
            size="20px"
            class="cursor-pointer z-top absolute-top-right q-ma-sm"
            text-color="grey-7"
            color="grey-5"
            icon="close"
            v-close-popup
          />
        </div>
        <!-- label="ENTER" -->
        <q-btn
          push
          icon="check"
          color="brown-9"
          v-close-popup
          @click="selectAllWahana"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { wahanaStore } from "src/stores/wahana-store";
// import Clock from "src/components/Clock.vue";
import DetailTransaksi from "src/components/DetailTransaksi.vue";
import WahanaCard from "src/components/WahanaCard.vue";
// import TicketCard from "src/components/TicketCard.vue";
// import PaymentDialog from "src/components/PaymentDialog.vue";
import { transaksiStore } from "src/stores/transaksi-store";
import { ref, onMounted, onBeforeMount, computed } from "vue";
import { useQuasar } from "quasar";
import SettingsDialog from "src/components/SettingsDialog.vue";
import ls from "localstorage-slim";
import LoginDialog from "src/components/LoginDialog.vue";
// import { generatePDF } from "src/utils/helpers";

const $q = useQuasar();
const qtyDialog = ref(false);
const qty = ref();
const daftarWahana = computed(() => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  console.log("dayOfWeek", dayOfWeek)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; // Monday to Thursday
  const isWeekendOrHoliday =
    dayOfWeek === 0 ||
    dayOfWeek === 5 ||
    dayOfWeek >= 6 ||
    isNationalHoliday(today); // Friday to Sunday or holiday

  return wahanaStore()
    .daftarWahana.filter((wahana) => {
      console.log(isWeekendOrHoliday)
      if (isWeekendOrHoliday) {
        return (
          (wahana.status === true &&
            wahana.hari?.toLowerCase() === "weekend") ||
          (wahana.status === true && wahana.hari?.toLowerCase() === "all day")
        );
      } else  {
        return (
          (wahana.status === true &&
            wahana.hari?.toLowerCase() === "weekday") ||
          (wahana.status === true && wahana.hari?.toLowerCase() === "all day")
        );
      }
    })
    .sort((a, b) => a.nama.localeCompare(b.nama));
});

function isNationalHoliday(date) {
  
  const nationalHolidays = [
    // Tahun 2024
    "2024-01-01", // New Year's Day
    "2024-02-08", // Isra Mi'raj
    "2024-02-10", // Chinese New Year
    "2024-03-11", // Bali Hindu New Year
    "2024-03-29", // Good Friday
    "2024-04-10", // Hari Raya Idul Fitri
    "2024-05-01", // Labour Day
    "2024-05-12", // Waisak Day
    "2024-05-29", // Ascension Day of Jesus Christ
    "2024-06-01", // Pancasila Day
    "2024-06-17", // Idul Adha
    "2024-07-07", // Islamic New Year
    "2024-08-17", // Independence Day
    "2024-09-05", // Prophet Muhammad's Birthday
    "2024-12-25", // Christmas Day

    // Tahun 2025
    "2025-01-01", // New Year's Day
    "2025-01-27", // Isra Mi'raj
    "2025-01-29", // Chinese New Year
    "2025-03-01", // Bali Hindu New Year
    "2025-03-31", // Hari Raya Idul Fitri
    "2025-04-18", // Good Friday
    "2025-05-01", // Labour Day
    "2025-05-12", // Waisak Day
    "2025-05-29", // Ascension Day of Jesus Christ
    "2025-06-01", // Pancasila Day
    "2025-06-07", // Idul Adha
    "2025-06-27", // Islamic New Year
    "2025-08-17", // Independence Day
    "2025-09-05", // Prophet Muhammad's Birthday
    "2025-12-25", // Christmas Day
  ];
   date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const dateStr = date.toISOString().split("T")[0];
  return nationalHolidays.includes(dateStr);
}

const daftarPaket = computed(() => {
  return wahanaStore().paket.filter((paket) => paket.status === true);
});

const selectAllWahana = () => {
  wahanaStore().daftarWahana.forEach((wahana) => {
    const data = ref({
      id_wahana: "",
      nama: "",
      qty: qty.value,
      tarif: "",
      total_bayar: "",
      deskripsi: "",
      jenis: "",
      hari: "",
      diskon: 0,
    });
    data.value.id_wahana = wahana.id_wahana?.toString();
    data.value.nama = wahana.nama;
    data.value.tarif = wahana.harga_tiket;
    data.value.total_bayar = wahana.harga_tiket * qty.value;
    data.value.qty = qty.value;
    data.value.deskripsi = wahana.deskripsi;
    data.value.jenis = wahana.nama_jenis_tiket;
    data.value.hari = wahana.hari;
    data.value.diskon = 0;

    console.log("test", data.value);
    transaksiStore().detailTransaksi.push(data.value);
    qtyDialog.value = false;
  });
  // console.log(data.value);
  // transaksiStore().addTransaksi(data.value);
};

// const onLogOut = () => {
//   ls.remove("petugas");
//   window.location.reload();
// };

const pilihPaket = async (paket) => {
  wahanaStore().pilihPaket(paket, wahanaStore().daftarWahana);
  transaksiStore().isPaket = true;

  transaksiStore().idPaket = paket.idPaket;

  const store = await transaksiStore().insertIntoDB();
  // console.log("store.id_transaksi", store.id_transaksi);
  // console.log("data", data);
  // return;
  if (store) {
    const data = {
      transaksi: JSON.stringify(transaksiStore().detailTransaksi),
      diskon: transaksiStore().diskon,
      totalAfterDiskon: transaksiStore().totalAfterDiskon,
      totalBayar: transaksiStore().totalBayar,
      namaPaket: wahanaStore().namaPaketTerpilih,
      no_transaksi: store.no_transaksi,
    };

    // generatePDF(data);
    window.electron.createPDFStruk(data, ls.get("namaPrinter"));
    // window.electron.print(ls.get("namaPrinter"));
    $q.notify({
      message: "Berhasil",
      color: "green",
      position: "top",
    });

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
};

// const onClickCash = () => {
//   const dialog = $q.dialog({
//     component: PaymentDialog,

//   })

//   dialog.update()
//   // transaksiStore().addTransaksi();
// };

onBeforeMount(() => {});

onMounted(async () => {
  await wahanaStore().getPaketFromDB();
  if (!ls.get("petugas")) {
    const _loginDialog = $q.dialog({
      component: LoginDialog,
      persistent: true,
      props: {
        type: "login",
      },
    });
    _loginDialog.update();
  }

  // console.log(await window.electron.getHIDDevices());
  // console.log(await window.electron.readDataFromHID(27027, 45090));

  await wahanaStore().getWahanaFromDB();
  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !qtyDialog.value) {
      // await onSaveSettings();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
});
</script>
<style></style>
