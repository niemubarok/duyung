<template>
  <q-card>
    <q-card-section class="row">
      <div>
        <q-chip
          icon="fact_check"
          label="Daftar Transaksi"
          class="text-weight-bolder"
        />
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
      :items="reportStore().daftarTransaksi"
      :loading="isLoading"
    >
      <template v-slot:before>
        <thead class="thead-sticky">
          <tr class="text-left bg-grey-8 text-h5 text-weight-bolder text-white">
            <th
              v-for="col in columns"
              :key="'1--' + col.name"
              :align="col.align"
            >
              <span class="text-subtitle2">{{ col.name }}</span>
            </th>
          </tr>
        </thead>
      </template>

      <template v-if="!reportStore().daftarTransaksi.length" v-slot:after>
        <tr>
          <td align="center" colspan="7" class="text-grey-5">
            <h5>Tidak ada transaksi</h5>
          </td>
        </tr>
      </template>
      <template v-slot="{ item: row, index }">
        <tr
          :key="index"
          :class="{
            'bg-grey-2': index % 2 !== 0 && selectedRow !== index,
            'bg-green-9 text-white': selectedRow === index,
          }"
          class="cursor-pointer"
          @click.right.prevent="onRightClick(index)"
        >
          <td width="30px">
            <span class="text-subtitle2">{{ index + 1 }}</span>
          </td>
          <td align="left" width="140px">
            <span class="text-subtitle2">{{ row.no_transaksi }}</span>
          </td>
          <td align="center" width="140px">
            <span class="text-center text-subtitle2">{{ row.cara_bayar }}</span>
          </td>
          <td align="center" width="140px">
            <div class="row justify-between">
              <span class="text-grey-7">Rp</span>
              <span class="text-subtitle2">
                {{
                  parseInt(row.total)
                    ?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      currencyDisplay: "code",
                    })
                    .replace("IDR", "")
                    .trim()
                    .split(",")[0]
                }}</span
              >
            </div>
          </td>
          <td align="center" width="140px">
            <div class="row justify-between">
              <span class="text-grey-7">Rp</span>
              <span class="text-subtitle2">
                {{
                  parseInt(row.diskon)
                    ?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      currencyDisplay: "code",
                    })
                    .replace("IDR", "")
                    .trim()
                    .split(",")[0]
                }}</span
              >
            </div>
          </td>
          <td align="center" width="140px">
            <div class="row justify-between">
              <span class="text-grey-7">Rp</span>
              <span class="text-subtitle2">
                {{
                  parseInt(row.total_bayar)
                    ?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      currencyDisplay: "code",
                    })
                    .replace("IDR", "")
                    .trim()
                    .split(",")[0]
                }}</span
              >
            </div>
          </td>
          <td align="center" width="140px">
            <div class="row justify-between">
              <span class="text-body">
                {{ row.nama_paket }}
              </span>
            </div>
          </td>

          <q-menu touch-position context-menu @hide="onMenuHide(index)">
            <q-list dense style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="
                  onClickPrint(row.diskon, row.no_transaksi, row.nama_paket)
                "
              >
                <q-item-section>
                  <q-chip class="bg-transparent">
                    <q-avatar icon="print" color="brown" text-color="white" />
                    print
                  </q-chip>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                @click="onDelete(row.no_transaksi)"
                v-close-popup
              >
                <!-- @click="reportStore().deleteTransaksiFromDB(row.no_transaksi)" -->
                <q-item-section>
                  <q-chip class="bg-transparent text-red">
                    <q-avatar icon="delete" color="red" text-color="white" />
                    Hapus
                  </q-chip>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                @click="onClickDetail(row.no_transaksi)"
              >
                <q-item-section>
                  <q-chip class="bg-transparent text-blue">
                    <q-avatar icon="info" color="blue" text-color="white" />
                    Detail
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </tr>
      </template>
    </q-virtual-scroll>

    <q-card-section>
      <div class="flex row justify-between q-px-sm glass-dark q-py-md">
        <span class="text-h6 text-white"> Total </span>
        <span class="text-weight-bolder text-h6 text-white q-mr-sm">{{
          reportStore()
            .totalPendapatanTransaksi?.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })
            .split(",")[0]
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reportStore } from "src/stores/report-store";
import { transaksiStore } from "src/stores/transaksi-store";
import { wahanaStore } from "src/stores/wahana-store";
import { onMounted, ref, computed } from "vue";
import { date, useQuasar } from "quasar";
import DetailTransaksiDialog from "src/components/dialogues/DetailTransaksiDialog.vue";
import DeleteTransaksiDialog from "src/components/dialogues/DeleteTransaksiDialog.vue";
import ls from "localstorage-slim";
import { generatePDF } from "src/utils/helpers";

const $q = useQuasar();
const todaySelected = ref(false);
const startDateSelected = ref(false);
const endDateSelected = ref(false);
const store = reportStore();
const timeStamp = date.formatDate(Date.now(), "YYYY/MM/DD");
const datePicker = ref(timeStamp);
const proxyDate = ref(Date.now());
const isToday = ref(false);
const startDate = ref("");
const endDate = ref("");
const columns = [
  { name: "No", prop: "name", align: "left" },
  {
    name: "No. Transaksi",
    prop: "no_transaksi",
    align: "left",
    sortable: true,
  },
  { name: "Cara Bayar", prop: "cara_bayar", align: "center" },
  { name: "Total", prop: "total", align: "center" },
  { name: "Diskon", prop: "diskon", align: "center" },
  { name: "TotalBayar", prop: "total_bayar", align: "center" },
  { name: "Keterangan", prop: "nama_paket", align: "left" },
];

const selectedRow = ref();
const isLoading = ref(false);

const onRightClick = (index) => {
  selectedRow.value = index;
};

const onDelete = async (no_transaksi) => {
  const deleteDialog = $q.dialog({
    component: DeleteTransaksiDialog,
    componentProps: {
      no_transaksi: no_transaksi,
    },
  });

  deleteDialog.update();
};
const onMenuHide = (index) => {
  if (selectedRow.value === index) {
    selectedRow.value = "";
  }
};

const onClickDetail = async (no_transaksi) => {
  await transaksiStore().getDetailTransaksi(no_transaksi);
  const detailDialog = $q.dialog({
    component: DetailTransaksiDialog,
    props: {},
  });
  detailDialog.update();
};

const onClickPrint = async (diskon, no_transaksi, namaPaket) => {
  const detailTransaksi = await transaksiStore().getDetailTransaksi(
    no_transaksi
  );

  console.log("detailTransaksi", detailTransaksi);
  // console.log("diskon", diskon);

  await wahanaStore().getWahanaFromDB();
  let paket = {
    diskon,
    namaPaket: namaPaket,
    idWahana: detailTransaksi.map((item) => item.id_wahana),
  };

  wahanaStore().pilihPaket(paket, wahanaStore().daftarWahana);

  const data = {
    no_transaksi,
    transaksi: JSON.stringify(transaksiStore().detailTransaksi),
    diskon: transaksiStore().diskon,
    totalAfterDiskon: transaksiStore().totalAfterDiskon,
    totalBayar: transaksiStore().totalBayar,
    namaPaket: wahanaStore().namaPaketTerpilih,
  };

  // console.log("data di daftarTransaksi", data);
  // return;
  window.electron.createPDFStruk(data, ls.get("namaPrinter"));
  // generatePDF(data);

  // window.electron.print(ls.get("namaPrinter"));
  $q.notify({
    message: "Berhasil",
    color: "green",
    position: "top",
  });
  transaksiStore().resetTransaksi();
};
const todayBtn = async () => {
  isToday.value = true;
  startDateSelected.value = false;
  endDateSelected.value = false;
  // Ensure the time zone offset is accounted for so that startDate is set to today's date
  // const today = new Date();
  // today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  reportStore().startDate = "";
  reportStore().endDate = "";
  await store.getLaporanTransaksiFromDB();
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
    // endDate.value = proxyDate.value;
    // endDateSelected.value = true;
    // reportStore().startDate = startDate.value;
    // reportStore().endDate = startDate.value;
    if (new Date(proxyDate.value).getDate() == new Date(Date.now()).getDate()) {
      isToday.value = true;
      todaySelected.value = true;
    } else {
      isToday.value = false;
      todaySelected.value = false;
    }
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

    endDateSelected.value = true;
    endDate.value = proxyDate.value;
    console.log("endate", endDate.value);
    // reportStore().endDate = endDate.value;
  }
  await store.getLaporanTransaksiFromDB(startDate.value, endDate.value);
};

onMounted(async () => {
  await reportStore().getLaporanTransaksiFromDB();
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
