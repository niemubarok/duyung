<template>
  <q-card>
    <q-card-section class="row">
      <div>
        <q-chip
          icon="dataset"
          label="Daftar Paket"
          class="text-weight-bolder"
        />
      </div>
      <q-space />
      <div :style="!$q.screen.gt.sm ? '' : 'margin-top:10px;'">
        <q-space v-if="$q.screen.lt.sm" />
      </div>
    </q-card-section>

    <q-virtual-scroll
      type="table"
      :style="$q.screen.gt.md ? 'height: 75vh' : 'height: 70vh'"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="daftarPaket"
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

      <template v-if="!daftarPaket.length" v-slot:after>
        <tr>
          <td align="center" colspan="7" class="text-grey-5">
            <h5>Tidak ada wahana</h5>
          </td>
        </tr>
      </template>
      <!-- class="glass-light" -->
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
          <td>{{ index + 1 }}</td>
          <td align="left">
            <span class="text-subtitle2">{{ row.namaPaket }}</span>
            <q-popup-edit
              v-model="row.namaPaket"
              v-slot="scope"
              @save="(value) => update(row.idPaket, 'nama_paket', value)"
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
              <span class="text-weight-bolder">Rp</span>
              <span class="text-subtitle2"> {{ rp(row.hargaPaket) }}</span>
            </div>

            <q-popup-edit
              v-model="row.hargaPaket"
              v-slot="scope"
              @save="(value) => update(row.idPaket, 'harga_paket', value)"
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
          <td align="center" width="130px">
            <div class="row justify-between">
              <span class="text-weight-bolder">Rp</span>
              <span class="text-subtitle2"> {{ rp(row.diskon) }}</span>
            </div>

            <q-popup-edit
              v-model="row.diskon"
              v-slot="scope"
              @save="(value) => update(row.idPaket, 'diskon', value)"
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
                row.jenisPaket?.toLowerCase() == 'weekend'
                  ? 'text-red'
                  : 'text-green'
              "
            >
              {{ row.jenisPaket }}</span
            >
            <q-popup-edit
              v-model="row.jenisPaket"
              v-slot="scope"
              @save="(value) => update(row.idPaket, 'jenis_paket', value)"
            >
              <q-select
                filled
                v-model="scope.value"
                :options="['Weekend', 'Weekday']"
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
          <td align="left">
            <span class="text-subtitle2">{{ row.deskripsi }}</span>
            <q-popup-edit
              v-model="row.deskripsi"
              v-slot="scope"
              @save="(value) => update(row.idPaket, 'deskripsi', value)"
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
            <q-toggle
              v-model="row.status"
              color="green"
              checked-icon="check"
              unchecked-icon="close"
              @update:model-value="
                (value) => update(row.idPaket, 'status', value)
              "
            />
          </td>

          <!-- <td align="right">
            <q-badge
              text-color="white"
              class="q-ml-md cursor-pointer bg-transparent"
              @click="onDelete(row.idPaket)"
            >
              <q-icon name="delete" color="red" />
            </q-badge>
          </td> -->

          <q-menu touch-position context-menu @hide="onMenuHide(index)">
            <q-list dense style="min-width: 100px">
              <!-- <q-item
                clickable
                v-close-popup
                @click="
                  onClickPrint(row.diskon, row.no_transaksi, row.nama_paket)
                "
              > -->
              <!-- <q-item-section>
                  <q-chip class="bg-transparent">
                    <q-avatar icon="print" color="brown" text-color="white" />
                    print
                  </q-chip>
                </q-item-section>
              </q-item>
              <q-separator /> -->
              <q-item clickable v-close-popup @click="onDelete(row.idPaket)">
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
      <add-button
        title="Tambah Paket Baru"
        label="Tambah Paket"
        style="z-index: 2"
      >
        <template #form>
          <q-form @reset="onReset" class="q-gutter-md">
            <q-input
              ref="namaPaketRef"
              standout="bg-brown-9 text-yellow"
              v-model="newPaket.nama_paket"
              label="Nama Paket"
            />
            <q-select
              standout="bg-brown-9 text-yellow"
              v-model="newPaket.jenis_paket"
              :options="['Weekend', 'Weekday']"
              behavior="menu"
              label="Jenis Paket"
            />
            <q-input
              type="textarea"
              standout="bg-brown-9 text-yellow"
              v-model="newPaket.deskripsi"
              label="Deskripsi Paket"
              autogrow
            />
            <q-input
              standout="bg-brown-9 text-yellow"
              v-model="newPaket.harga_paket"
              type="number"
              label="Tarif Paket"
              prefix="Rp"
            />
            <q-input
              standout="bg-brown-9 text-yellow"
              v-model="newPaket.diskon"
              type="number"
              label="Tarif Paket"
              prefix="Rp"
            />
            <q-select
              standout="bg-brown-9 text-yellow"
              v-model="newPaket.status"
              :options="['Aktif', 'Tidak Aktif']"
              label="Status Paket"
              behavior="menu"
            />
            <q-select
              ref="detailWahanaRef"
              standout="bg-brown-9 text-yellow"
              v-model="modelMultiple"
              multiple
              :options="options"
              use-chips
              stack-label
              clearable
              options-dense
              behavior="dialog"
              label="Detail Wahana"
            >
              <!-- hide-selected -->
              <template v-slot:option="scope">
                <q-chip
                  v-bind="scope.itemProps"
                  class="q-pa-lg q-ma-sm shadow-1"
                  :class="scope.selected ? 'bg-green-4' : ''"
                >
                  {{ scope.opt.label }}
                </q-chip>
                <!-- <q-item-section class="row">
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.harga }}</q-item-label>
                    <q-separator />
                  </q-item-section>
                </q-item> -->
              </template>
              <template #after-options>
                <div class="row full-width justify-end q-pa-md">
                  <q-btn
                    icon="close"
                    label="selesai"
                    color="brown"
                    @click="detailWahanaRef.hidePopup"
                  />
                </div>
              </template>
            </q-select>
          </q-form>
        </template>
        <template #button>
          <div class="row">
            <q-btn
              label="Simpan"
              type="submit"
              color="brown-9"
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
import { transaksiStore } from "src/stores/transaksi-store";
import { componentStore } from "src/stores/component-store";
import AddButton from "src/components/AddButton.vue";
import { onMounted, ref, computed } from "vue";
import { date, useQuasar } from "quasar";
import { rp } from "src/utils/helpers";

const $q = useQuasar();
const columns = [
  { name: "No", prop: "no", align: "left" },
  { name: "Nama Paket", prop: "nama_paket", align: "left" },
  { name: "Harga Paket", prop: "harga_paket", align: "center" },
  { name: "Diskon", prop: "diskon", align: "center" },
  { name: "Jenis", prop: "jenis", align: "center" },
  { name: "Deskripsi", prop: "deskripsi", align: "left" },
  { name: "Status", prop: "status", align: "center" },
  // { name: "TotalBayar", prop: "total_bayar", align: "right" },
  // { name: "Hapus", prop: "hapus", align: "right" },
];
const detailWahanaRef = ref();
const namaPaketRef = ref();

const modelMultiple = ref([]);

const options = ref([]);
const newPaket = ref({
  nama_paket: "",
  jenis_paket: "",
  harga_paket: "",
  diskon: "0",
  deskripsi: "-",
  status: "Aktif",
  id_wahana: [],
});

const onSubmit = async () => {
  try {
    if (
      newPaket.value.nama_paket &&
      newPaket.value.jenis_paket &&
      // newPaket.value.deskripsi
      // &&
      newPaket.value.harga_paket > 0 &&
      modelMultiple.value?.length
    ) {
      newPaket.value.id_wahana = modelMultiple.value.map((wahana) => {
        return wahana.value;
      });
      console.log(newPaket.value);

      const store = await wahanaStore().addPaketToDB(newPaket.value);
      if (store) {
        // wahanaStore.paket.push(newPaket.value);
        newPaket.value = {
          nama_paket: "",
          jenis_paket: "",
          harga_paket: "",
          diskon: "",
          deskripsi: "",
          status: "",
        };
        componentStore().nextMorph();
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: "GAGAL",
          icon: "report_problem",
        });
      }
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

const onReset = () => {
  newPaket.value = {
    nama_paket: "",
    jenis_paket: "",
    harga_paket: "",
    diskon: "",
    deskripsi: "",
    status: "",
  };
  modelMultiple.value = [];
  namaPaketRef.value.focus();
};

const update = async (id, column, value) => {
  console.log(id, column, value);
  const editWahana = await wahanaStore().editPaketOnDB(id, column, value);
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
  const deleted = await wahanaStore().deletePaketFromDB(id);
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

const selectedRow = ref();
const isLoading = ref(false);
const showMenu = ref(false);

const onRightClick = (index) => {
  selectedRow.value = index;
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

const daftarPaket = computed(() => {
  return wahanaStore().paket;
});

// const onClickPrint = asy;

onMounted(async () => {
  await wahanaStore().getPaketFromDB();
  const wahana = (await wahanaStore().getWahanaFromDB()).map((item) => ({
    value: item.id_wahana,
    label: item.nama,
    harga: item.harga_tiket,
  }));

  console.log(wahana);
  options.value.splice(0, options.value.length, ...wahana);
  // isToday.value = true;
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
