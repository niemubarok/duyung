<template>
  <q-card>
    <q-card-section class="row">
      <div>
        <q-chip icon="apps" label="Daftar Wahana" class="text-weight-bolder" />
      </div>
      <q-space />
      <div :style="!$q.screen.gt.sm ? '' : 'margin-top:10px;'">
        <q-space v-if="$q.screen.lt.sm" />
        <!-- <q-btn
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
        </q-btn> -->
      </div>
    </q-card-section>

    <q-virtual-scroll
      type="table"
      :style="$q.screen.gt.md ? 'height: 75vh' : 'height: 70vh'"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="daftarWahana"
      sort-by="nama"
    >
      <template v-slot:before>
        <thead class="thead-sticky">
          <tr class="text-left bg-grey-8">
            <th
              class="text-h4 text-weight-bolder text-white"
              v-for="col in columns"
              :key="'1--' + col.name"
              :align="col.align"
            >
              {{ col.name }}
            </th>
          </tr>
        </thead>
      </template>

      <template v-if="!daftarWahana?.length" v-slot:after>
        <tr>
          {{
            daftarWahana
          }}
          <td align="center" colspan="7" class="text-grey-5">
            <h5>Tidak ada wahana</h5>
          </td>
        </tr>
      </template>
      <!-- class="glass-light" -->
      <template v-slot="{ item: row, index }">
        <tr :key="index" :class="index % 2 == 0 ? 'bg-white' : 'bg-grey-2'">
          <td>{{ index + 1 }}</td>
          <td align="left">
            <span class="text-subtitle2">{{ row.nama }}</span>
            <!-- v-if="isEditMode" -->
            <q-popup-edit
              v-model="row.nama"
              v-slot="scope"
              @save="(value) => update(row.id_wahana, 'nama', value)"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
              <div class="float-right">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="scope.cancel"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="scope.set"
                />
              </div>
            </q-popup-edit>
          </td>
          <!-- <td align="center">
            <span class="text-center text-subtitle2">{{ row.harga_tiket }}</span>
          </td> -->
          <td align="center" width="140px">
            <div class="row justify-between">
              <span class="text-grey-7">Rp</span>
              <span class="text-subtitle2">
                {{
                  parseInt(row.harga_tiket)
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
            <q-popup-edit
              v-model="row.diskon"
              v-slot="scope"
              @save="(value) => update(row.id_wahana, 'diskon', value)"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
              <div class="float-right">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="scope.cancel"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="scope.set"
                />
              </div>
            </q-popup-edit>
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
            <q-popup-edit
              v-model="row.diskon"
              v-slot="scope"
              @save="(value) => update(row.id_wahana, 'diskon', value)"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
              <div class="float-right">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="scope.cancel"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="scope.set"
                />
              </div>
            </q-popup-edit>
          </td>
          <td align="center">
            <span
              class="text-subtitle2"
              :class="
                row.hari?.toLowerCase() == 'weekend' ? 'text-red' : 'text-green'
              "
            >
              {{ row.hari }}</span
            >
            <q-popup-edit
              v-model="row.hari"
              v-slot="scope"
              @save="(value) => update(row.id_wahana, 'hari', value)"
            >
              <q-select
                filled
                v-model="scope.value"
                :options="['Weekend', 'Weekday', 'All Day']"
                label="Hari"
              />
              <div class="float-right">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="scope.cancel"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="scope.set"
                />
              </div>
            </q-popup-edit>
          </td>
          <td align="center">
            <span class="text-subtitle2"> {{ row.nama_jenis }}</span>
            <q-popup-edit
              v-model="row.nama_jenis"
              v-slot="scope"
              @save="(value) => updateJenis(row.id_wahana, 'id_jenis', value)"
            >
              <q-select
                filled
                v-model="scope.value"
                :options="wahanaStore().jenisTiket"
                option-value="id"
                label="Jenis Wahana"
              />
              <div class="float-right">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="scope.cancel"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="scope.set"
                />
              </div>
            </q-popup-edit>
          </td>
          <td align="center">
            <q-toggle
              v-model="row.status"
              color="green"
              checked-icon="check"
              unchecked-icon="close"
              @update:model-value="
                (value) => update(row.id_wahana, 'status', value)
              "
            />
          </td>
          <td align="left" width="200px">
            <span class="text-subtitle2" style="white-space: pre-line">
              {{ row.deskripsi }}</span
            >
            <!-- (value) => { -->
            <!-- } else {
              update(row.id_wahana, 'deskripsi', multipleWahanaSelection);
            } -->
            <q-popup-edit
              v-model="row.deskripsi"
              v-slot="scope"
              @save="
                if (row.nama_jenis?.toLowerCase() !== 'tiket masuk') {
                  update(row.id_wahana, 'deskripsi', value);
                }
              "
            >
              <!-- v-if="row.nama_jenis?.toLowerCase() !== 'tiket masuk'" -->
              <q-input
                type="textarea"
                v-model="scope.value"
                autofocus
                autogrow
                @keyup.enter="scope.set"
              />
              <!-- <q-select
                v-else
                multiple
                v-model="multipleWahanaSelection"
                :options="daftarWahana"
                :option-value="'nama'"
                :option-label="'nama'"
                dense
                label="Standard"
                filled
              /> -->
              <div class="float-right">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="scope.cancel"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="scope.set"
                />
              </div>
            </q-popup-edit>
          </td>
          <td align="right">
            <q-badge
              @click="onDelete(row.id_wahana)"
              text-color="white"
              class="q-ml-md cursor-pointer bg-transparent"
            >
              <q-icon name="delete" color="red" />
            </q-badge>
          </td>
        </tr>
      </template>
    </q-virtual-scroll>

    <q-card-section>
      <add-button title="Tambah Wahana Baru" style="z-index: 2">
        <template #form>
          <q-form @reset="onReset" class="q-gutter-md">
            <q-input filled v-model="newWahana.nama" label="Nama Wahana" />
            <!-- emit-value -->
            <q-select
              filled
              v-model="newWahana.jenis"
              :options="wahanaStore().jenisTiket"
              option-value="id"
              option-label="label"
              label="Jenis Wahana"
            />
            <q-select
              filled
              v-model="newWahana.hari"
              :options="['Weekend', 'Weekday', 'All Day']"
              label="Hari"
            />
            <q-input
              type="textarea"
              filled
              v-model="newWahana.deskripsi"
              label="Deskripsi Wahana"
            />
            <q-input
              filled
              v-model="newWahana.harga_tiket"
              label="Tarif Wahana"
              prefix="Rp"
            />
            <q-input
              filled
              v-model="newWahana.diskon"
              label="Diskon"
              prefix="Rp"
            />
          </q-form>
        </template>
        <template #button>
          <div class="row">
            <q-btn
              label="Simpan"
              type="submit"
              color="primary"
              @click="onSubmit"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="secondary"
              flat
              class="q-ml-md"
              @click="onReset"
            />
          </div>
        </template>
      </add-button>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { wahanaStore } from "src/stores/wahana-store";
import { componentStore } from "src/stores/component-store";
import { transaksiStore } from "src/stores/transaksi-store";
import { onMounted, ref, computed } from "vue";
import { date, useQuasar } from "quasar";
import AddButton from "src/components/AddButton.vue";

const $q = useQuasar();
const todaySelected = ref(false);
const startDateSelected = ref(false);
const endDateSelected = ref(false);
const store = wahanaStore();
// const laporanWahana = ref([]);
const laporanPendapatan = ref([]);
const laporanKunjungan = ref([]);
const timeStamp = date.formatDate(Date.now(), "YYYY/MM/DD");
const datePicker = ref(timeStamp);
const proxyDate = ref(Date.now());
const isLoading = ref(true);
const startDate = ref("");
const endDate = ref("");
const columns = [
  { name: "No", prop: "name", align: "left" },
  { name: "Nama Wahana", prop: "nama", align: "left" },
  { name: "Harga Tiket", prop: "harga_tiket", align: "center" },
  { name: "Diskon", prop: "diskon", align: "center" },
  { name: "Hari", prop: "hari", align: "center" },
  { name: "Jenis", prop: "jenis", align: "center" },
  { name: "Status", prop: "status", align: "center" },
  { name: "Keterangan", prop: "deskripsi", align: "left" },
  { name: "Hapus", prop: "hapus", align: "right" },
];

const multipleWahanaSelection = ref([]);

const newWahana = ref({
  nama: "",
  jenis: "",
  deskripsi: "-",
  hari: "",
  harga_tiket: 0,
  diskon: 0,
  status: true,
});

const onReset = () => {
  newWahana.value = {
    nama: "",
    jenis: "",
    deskripsi: "-",
    hari: "",
    harga_tiket: 0,
    diskon: 0,
    status: true,
  };
};

const onSubmit = async () => {
  try {
    if (
      newWahana.value.nama &&
      newWahana.value.jenis &&
      newWahana.value.deskripsi
      // &&
      // newWahana.value.harga_tiket > 0
    ) {
      console.log(newWahana.value);
      await wahanaStore().addMasterWahanaToDB(newWahana.value);
      onReset();
      componentStore().nextMorph();
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Semua field harus diisi ",
        icon: "report_problem",
      });
    }
    // Notify success
  } catch (error) {
    // Notify error
  }
};

const update = async (id, column, value) => {
  console.log(id, column, value);
  const editWahana = await wahanaStore().editMasterWahanaOnDB(
    id,
    column,
    value
  );
  if (editWahana) {
    $q.notify({
      message: "Berhasil di ubah",
      type: "positive",
      position: "top",
    });
  }
};
const updateJenis = async (id, column, value) => {
  console.log(id, column, value);
  const editWahana = await wahanaStore().editJenisTiketOnDB(id, column, value);
  if (editWahana) {
    $q.notify({
      message: "Berhasil di ubah",
      type: "positive",
      position: "top",
    });
  }
};

const onDelete = async (id) => {
  console.log(id);
  const deleted = await wahanaStore().deleteMasterWahanaFromDB(id);
  if (deleted) {
    $q.notify({
      message: "Berhasil di hapus",
      type: "positive",
      position: "top",
    });
  } else {
    $q.notify({
      message: "Gagal hapus data",
      type: "negative",
      position: "top",
    });
  }
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

  await store.getLaporanTransaksiFromDB();
  // await store.getLaporanPendapatan();
};

const daftarWahana = computed(() => {
  return wahanaStore().daftarWahana.sort((a, b) =>
    a.nama.localeCompare(b.nama)
  );
});

onMounted(async () => {
  await wahanaStore().getWahanaFromDB();
  await wahanaStore().getJenisTiketFromDB();
  isLoading.value = false;
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
