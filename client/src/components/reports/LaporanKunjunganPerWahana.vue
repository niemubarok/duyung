<template>
  <q-card>
    <q-card-section class="row">
      <div class="column">
        <div>
          <q-chip
            icon="bar_chart"
            label="Laporan Penjualan Tiket"
            class="text-weight-bolder"
          />
        </div>
        <div class="row q-mt-sm">
          <q-btn
            push
            class="bg-brown text-white q-mr-sm"
            label="Semua"
            @click="jenisTiket = 'Semua'"
          />
          <q-btn
            push
            class="bg-brown text-white q-mr-sm"
            label="Tiket Masuk"
            @click="jenisTiket = 'Tiket Masuk'"
          />
          <!-- icon="in" -->
          <q-btn
            push
            class="bg-brown text-white"
            label="Tiket Satuan"
            @click="jenisTiket = 'Tiket Wahana'"
          />
          <!-- icon="directions" -->
        </div>
      </div>
      <q-space />
      <div :style="!$q.screen.gt.sm ? '' : 'margin-top:10px;'">
        <q-space v-if="$q.screen.lt.sm" />
        <q-btn
          v-model:selected="todaySelected"
          style="z-index: 1"
          class="shadow-4 q-ma-sm"
          rounded
          :class="isToday ? 'bg-secondary text-white' : 'bg-grey-7 text-grey-2'"
          dark
          @click="todayBtn()"
          >Hari Ini</q-btn
        >
        <q-btn
          style="z-index: 2"
          icon="event"
          rounded
          :label="startDateSelected ? startDateLabel() : 'Pilih Tanggal'"
          :class="
            startDateSelected && !todaySelected
              ? 'bg-secondary text-white'
              : 'bg-grey-7 text-grey-2'
          "
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
            class="z-max"
            @before-show="updateProxy"
          >
            <q-date v-model="proxyDate" :options="optionFn">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn
                  v-close-popup
                  label="Cancel"
                  color="primary"
                  flat
                  @click="
                    startDateSelected = false;
                    endDateSelected = false;
                  "
                />
                <q-btn
                  v-close-popup
                  label="OK"
                  color="primary"
                  flat
                  @click="save('start')"
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <span class="q-mx-sm">s/d</span>
        <q-btn
          style="z-index: 2"
          icon="event"
          rounded
          :label="endDateSelected ? endDateLabel() : 'Pilih Tanggal'"
          :class="
            endDateSelected && !todaySelected
              ? 'bg-secondary text-white'
              : 'bg-grey-7 text-grey-2'
          "
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
            class="z-max"
            @before-show="updateProxy"
          >
            <q-date v-model="proxyDate" :options="optionFn">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn v-close-popup label="Cancel" color="primary" flat />
                <q-btn
                  v-close-popup
                  label="OK"
                  color="primary"
                  flat
                  @click="save('end')"
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
    </q-card-section>

    <q-virtual-scroll
      type="table"
      :style="$q.screen.gt.md ? 'height: 70vh' : 'height: 65vh'"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="laporanWahana"
    >
      <template v-slot:before>
        <thead>
          <tr
            class="thead-sticky text-left bg-grey-8 text-white text- weight-bolder"
          >
            <th
              v-for="col in columns"
              :key="'1--' + col.name"
              :align="col.align"
            >
              {{ col.name }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-if="!reportStore().laporanWahana?.length" v-slot:after>
        <tr>
          <td align="center" colspan="7" class="text-grey-5">
            <h5>Tidak ada transaksi</h5>
          </td>
        </tr>
      </template>
      <!-- class="glass-light" -->
      <template v-slot="{ item: row, index }">
        <tr :key="index">
          <td width="20px">{{ index + 1 }}</td>
          <td align="left" width="150px">
            <span class="text-subtitle2">{{ row.nama_wahana }}</span>
          </td>
          <td align="center">
            <!-- <span class="text-center text-subtitle2">{{ row.jumlah }}</span> -->
            <q-linear-progress
              stripe
              rounded
              size="20px"
              :value="row.jumlah / 10"
              :color="getColor(row.jumlah)"
              class="q-mt-sm relative"
            >
              <div class="absolute-top-right flex flex-center">
                <q-badge
                  color="brown"
                  text-color="yellow"
                  class="text-body"
                  :label="row.jumlah"
                />
              </div>
            </q-linear-progress>
          </td>
          <!-- <td align="right">
            <span class="text-subtitle2">
              {{
                parseInt(row.pendapatan)
                  ?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                  .split(",")[0]
              }}</span
            >
          </td> -->
        </tr>
      </template>
      <template v-slot:after> </template>
    </q-virtual-scroll>

    <q-card-section>
      <div class="flex row justify-between q-px-sm glass-dark q-py-md">
        <span class="text-h6 text-white"> Total {{ jenisTiket }} </span>
        <span class="text-weight-bolder text-h6 text-white q-mr-sm">{{
          totalKunjungan
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reportStore } from "src/stores/report-store";
import { onMounted, ref, computed } from "vue";
import { date, useQuasar } from "quasar";

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
  // { name: "Pendapatan", prop: "pendapatan", align: "right" },
];

const todayBtn = async () => {
  isToday.value = true;
  startDateSelected.value = false;
  endDateSelected.value = false;
  // Ensure the time zone offset is accounted for so that startDate is set to today's date
  // const today = new Date();
  // today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  // reportStore().startDate = today.toISOString().split("T")[0];
  // reportStore().endDate = today.toISOString().split("T")[0];
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

    if (
      new Date(startDate.value).toDateString() === new Date().toDateString() &&
      new Date(endDate.value).toDateString() === new Date().toDateString()
    ) {
      isToday.value = true;
      todaySelected.value = true;
    } else {
      isToday.value = false;
      todaySelected.value = false;
    }
    // endDate.value = proxyDate.value;
    // reportStore().startDate = startDate.value;
  } else if (type === "end") {
    if (
      new Date(proxyDate.value).getTime() < new Date(startDate.value).getTime()
    ) {
      $q.notify({
        color: "negative",
        textColor: "white",
        icon: "error",
        message: "Tanggal akhir tidak boleh Kurang dari tanggal mulai!",
      });
      return;
    }

    if (
      new Date(startDate.value).toDateString() === new Date().toDateString() &&
      new Date(endDate.value).toDateString() === new Date().toDateString()
    ) {
      isToday.value = true;
      todaySelected.value = true;
    } else {
      isToday.value = false;
      todaySelected.value = false;
    }

    endDateSelected.value = true;
    endDate.value = proxyDate.value;
    console.log("endate", endDate.value);
    // reportStore().endDate = endDate.value;
    await store.getLaporanKunjunganWahana(startDate.value, endDate.value);
  }

  // await store.getLaporanPendapatan();
};

const highestTotal = ref(0);

const calculatePercentage = (value) => (value / highestTotal.value) * 100;

const getColor = (jumlah) => {
  const percentage = calculatePercentage(jumlah);

  if (percentage <= 20) return "red";
  if (percentage <= 40) return "orange";
  if (percentage <= 60) return "yellow";
  if (percentage <= 80) return "lightgreen";
  return "green";
};

const jenisTiket = ref("Semua");

const laporanWahana = computed(() => {
  if (jenisTiket.value === "Semua") {
    return reportStore().laporanWahana;
  } else {
    return reportStore().laporanWahana.filter(
      (wahana) =>
        wahana.jenis_tiket?.toLowerCase() === jenisTiket.value.toLowerCase()
    );
  }
});
const totalKunjungan = computed(() => {
  return laporanWahana.value?.reduce(
    (total, item) => total + parseInt(item.jumlah),
    0
  );
});
// const laporanWahana = ref([])

onMounted(async () => {
  await reportStore().getLaporanKunjunganWahana();
  highestTotal.value = Math.max(
    ...reportStore().laporanWahana.map((item) => item.jumlah)
  );
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
