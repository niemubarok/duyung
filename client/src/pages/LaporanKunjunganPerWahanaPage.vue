<template>
  <q-page padding>
    <laporan-kunjungan-per-wahana />
  </q-page>
</template>

<script setup>
import { reportStore } from "src/stores/report-store";
import { onMounted, ref } from "vue";
import { date, useQuasar } from "quasar";
import LaporanKunjunganPerWahana from "src/components/reports/LaporanKunjunganPerWahana.vue";

const $q = useQuasar();
const todaySelected = ref(false);
const startDateSelected = ref(false);
const endDateSelected = ref(false);
const store = reportStore();
// const laporanWahana = ref([]);
const laporanPendapatan = ref([]);
const laporanKunjungan = ref([]);
const timeStamp = date.formatDate(Date.now(), "YYYY/MM/DD");
const datePicker = ref(timeStamp);
const proxyDate = ref(Date.now());
const isToday = ref(false);
const startDate = ref("");
const endDate = ref("");
const columns = [
  { name: "No", prop: "name", align: "left" },
  { name: "Nama Wahana", prop: "nama_wahana", align: "left" },
  { name: "Jumlah", prop: "jumlah", align: "center" },
  { name: "Pendapatan", prop: "pendapatan", align: "right" },
  // { name: 'Protein (g)', prop: 'protein' }
];

const todayBtn = async () => {
  isToday.value = !isToday.value;
  startDateSelected.value = false;
  endDateSelected.value = false;
  // Ensure the time zone offset is accounted for so that startDate is set to today's date
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  reportStore().startDate = today.toISOString().split("T")[0];
  reportStore().endDate = today.toISOString().split("T")[0];
  await store.getLaporanKunjunganWahana();
};

const dayLabel = (dateValue) => {
  const daysInIndonesian = {
    Sunday: "Minggu",
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
  };
  const dayInEnglish = date.formatDate(dateValue, "dddd");
  const dateInIndonesian = daysInIndonesian[dayInEnglish];

  return dateValue
    ? `${dateInIndonesian}, ${date.formatDate(dateValue, "DD-MM-YYYY")}`
    : "PILIH TANGGAL";
};

const startDateLabel = () => dayLabel(startDate.value);
const endDateLabel = () => dayLabel(endDate.value);

const updateProxy = () => {
  proxyDate.value = datePicker.value;
  // chooseDateSelected.value = true;
};
const optionFn = (proxyDate) => {
  // const aWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return proxyDate <= timeStamp;
};

const save = async (type) => {
  const isDateAfterToday = new Date(proxyDate.value).getTime() > Date.now();

  if (isDateAfterToday) {
    $q.notify({
      color: "negative",
      textColor: "white",
      icon: "error",
      message: "Tanggal tidak boleh lebih dari hari ini!",
    });
    return;
  }
  if (type === "start") {
    startDateSelected.value = true;
    startDate.value = proxyDate.value;
    endDate.value = proxyDate.value;
    reportStore().startDate = startDate.value;
    if (new Date(proxyDate.value).getDate() == new Date(Date.now()).getDate()) {
      isToday.value = true;
      todaySelected.value = true;
    } else {
      isToday.value = false;
      todaySelected.value = false;
    }
  } else if (type === "end") {
    endDateSelected.value = true;
    endDate.value = proxyDate.value;
    console.log("endate", endDate.value);
    reportStore().endDate = endDate.value;
  }

  await store.getLaporanKunjunganWahana();
  // await store.getLaporanPendapatan();
};

onMounted(async () => {
  await reportStore().getLaporanKunjunganWahana();
  isToday.value = true;
});
</script>

<style lang="sass">
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1

.thead-sticky tr:last-child > *
  top: 0

.tfoot-sticky tr:first-child > *
  bottom: 0
</style>
