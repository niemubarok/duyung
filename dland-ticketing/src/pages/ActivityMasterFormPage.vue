<template>
  <q-page padding>
    <q-card bordered flat class="q-mt-md" style="border-top: 2px solid #00a1e8">
      <q-table
        table-class="q-mt-md full-width"
        :rows-per-page-options="[10, 20]"
        :columns="columns"
        :rows="tableRows"
        row-key="name"
        separator="cell"
      >
        <template #top>
          <div class="row">
            <q-chip
              square
              size="md"
              class="bg-transparent text-weight-bolder text-grey-9"
            >
              <q-icon size="md" name="event" />
              Master Aktivitas Santri
            </q-chip>
          </div>
          <q-space />
          <!-- <q-input clearable outlined rounded dense debounce="300" v-model="componentStore.searchModel"
            placeholder="Cari Aktivitas..." input-class="q-pr-xl" input-style="width:30vw" @clear="onClearSearch">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> -->
          <q-space />
          <q-space />
          <q-space />
          <q-select
            dense
            v-model="filterModel"
            :options="dayOptions"
            label="Filter Hari"
            label-color="grey-7"
            flat
            clearable
            style="width: 150px"
            @clear="onClearFilter"
          >
            <template #prepend>
              <q-icon name="filter_alt" size="xs" class="text-orange-9" />
            </template>
          </q-select>
          <q-space />
          <q-toggle
            label="Edit Mode"
            @update:model-value="disableEditMode"
            v-model="isEditMode"
            checked-icon="edit"
            color="green"
            unchecked-icon="clear"
          />
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props"
              ><q-chip class="bg-transparent">
                <span class="text-weight-bolder">{{ col.label }}</span></q-chip
              ></q-th
            >
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="props.pageIndex % 2 == 0 ? 'bg-green-1' : 'bg-grey-1'"
          >
            <q-menu
              touch-position
              auto-close
              context-menu
              anchor="center end"
              self="center start"
            >
              <q-btn
                size="xs"
                icon="delete"
                color="red"
                label="delete"
                @click="onDeleteConfirm(props.row.name, props.row.id)"
              />
            </q-menu>
            <q-td key="name" :props="props" style="width: 20px">
              <p class="text-center">{{ props.pageIndex + 1 }}</p>
            </q-td>
            <q-td
              key="name"
              :class="{ 'cursor-pointer': isEditMode }"
              :props="props"
              >{{ props.row.name }}
              <!-- <q-tooltip anchor="center middle" self="center middle" class="bg-transparent text-grey-7">
                <q-icon name="edit" size="xs" />
                <small> Klik untuk edit</small>
              </q-tooltip> -->
              <q-popup-edit
                v-if="isEditMode"
                v-model="props.row.name"
                v-slot="scope"
                persistent
                @save="(value) => update(props.row.id, 'name', value)"
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
              <q-icon v-if="isEditMode" name="edit" size="xs" />
            </q-td>
            <q-td
              key="day"
              :class="{ 'cursor-pointer': isEditMode }"
              :props="props"
              >{{ props.row.day }}
              <q-popup-edit
                v-if="isEditMode"
                v-model="props.row.day"
                v-slot="scope"
                persistent
                @save="(value) => update(props.row.id, 'day', value)"
              >
                <q-select
                  class="q-mb-md"
                  color="grey-3"
                  label-color="orange"
                  v-model="scope.value"
                  :options="dayOptions"
                  label="Hari"
                >
                </q-select>

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
              <q-icon v-if="isEditMode" name="edit" size="xs" />
            </q-td>

            <q-td key="jam" :props="props">
              <q-chip
                :class="{ 'cursor-pointer': isEditMode }"
                color="green-3"
                :label="props.row.start"
              >
                <q-popup-proxy
                  v-if="isEditMode"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="props.row.start" format24h with-seconds>
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        size="sm"
                        color="red-9"
                        flat
                        icon="close"
                        v-close-popup
                      />
                      <q-btn
                        size="sm"
                        color="green-9"
                        flat
                        icon="check"
                        @click="update(props.row.id, 'start', props.row.start)"
                        v-close-popup
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
                <q-icon v-if="isEditMode" name="edit" size="xs" />
              </q-chip>
              s/d
              <q-chip
                :class="{ 'cursor-pointer': isEditMode }"
                color="orange-3"
                :label="props.row.end"
              >
                <q-popup-proxy
                  v-if="isEditMode"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="props.row.end" format24h with-seconds>
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        size="sm"
                        color="red-9"
                        flat
                        icon="close"
                        v-close-popup
                      />
                      <q-btn
                        size="sm"
                        color="green-9"
                        flat
                        icon="check"
                        @click="update(props.row.id, 'end', props.row.end)"
                        v-close-popup
                      />
                    </div>
                  </q-time> </q-popup-proxy
                ><q-icon v-if="isEditMode" name="edit" size="xs" /> </q-chip
            ></q-td>
            <q-td
              key="order"
              :class="{ 'cursor-pointer': isEditMode }"
              :props="props"
              >{{ props.row.order }}
              <q-popup-edit
                v-if="isEditMode"
                v-model="props.row.order"
                v-slot="scope"
                persistent
                @save="(value) => update(props.row.id, 'order', value)"
              >
                <q-input
                  v-model="scope.value"
                  type="number"
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
              <q-icon v-if="isEditMode" name="edit" size="xs" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <!-- //morph -->
    <add-button ref="addBtnRef" title="Form Tambah Aktivitas">
      <template #form>
        <q-input
          class="q-mb-md"
          v-model="formModel.name"
          type="text"
          :rules="[(val) => val.length >= 3 || 'Nama minimal 3 huruf']"
          label="Nama Aktivitas"
        />

        <q-select
          class="q-mb-md"
          color="grey-3"
          label-color="orange"
          v-model="formModel.day"
          :options="dayOptions"
          label="Hari"
        >
        </q-select>

        <time-picker
          label="Jam Mulai"
          :model-value="formModel.start"
          :rules="['fulltime']"
          error="Format Waktu Salah"
        />
        <time-picker
          label="Jam Selesai"
          :model-value="formModel.end"
          :rules="['fulltime']"
          error="Format Waktu Salah"
        />

        <q-input
          class="q-mb-md"
          outlined
          v-model="formModel.order"
          type="number"
          label="Jam Ke"
        />
      </template>

      <template #button>
        <q-btn
          class="absolute-bottom-right text-white q-ma-md"
          color="teal-9"
          label="Simpan"
          @click="onSaveForm"
        />
      </template>
    </add-button>
  </q-page>
</template>

<script setup>
import { useStudentActivitiesStore } from "src/stores/student-activities-store";
import { onBeforeMount, onMounted, ref, computed } from "vue";
import { dayName } from "src/utilities/time-util";
import AddButton from "src/components/AddButton.vue";
import TimePicker from "src/components/TimePicker.vue";
import { Notify } from "quasar";
import { useComponentStore } from "src/stores/component-store";

const componentStore = useComponentStore();
const dayOptions = ["Daily", "Weekday", ...dayName];

const studentActivityStore = useStudentActivitiesStore();
const filterModel = ref("");
const columns = [
  {
    name: "no",
    label: "NO",
    align: "center",
  },
  {
    name: "name",
    label: "NAMA AKTIVITAS",
    align: "left",
    // sortable: true
  },
  {
    name: "day",
    label: "HARI",
    align: "center",
    // sortable: true
  },
  {
    name: "jam",
    label: "JAM",
    align: "center",
  },
  {
    name: "order",
    label: "JAM KE",
    align: "center",
    // sortable: true
  },
];

const tableRows = computed(() => {
  return studentActivityStore.all
    .filter((activities) =>
      activities?.day?.toLowerCase().includes(filterModel.value?.toLowerCase())
    )
    .filter((rows) =>
      rows.name
        ?.toLowerCase()
        .includes(componentStore.searchModel.toLowerCase())
    );
});

const isEditMode = ref(false);
const disableEditMode = () => {
  setTimeout(() => {
    if (isEditMode.value == true) {
      isEditMode.value = false;
    }
  }, 20000);
};

const onClearFilter = () => {
  filterModel.value = "";
};
const addBtnRef = ref(null);

const formModel = ref({
  name: "",
  day: "",
  start: "00:00:00",
  end: "00:00:00",
  order: 0,
});

const onSaveForm = () => {
  studentActivityStore.createActivity(formModel.value);
  addBtnRef.value.nextMorph();
};

const update = (id, column, value) => {
  studentActivityStore.updateActivity(id, column, value);
};

const onDeleteConfirm = (name, id) => {
  Notify.create({
    message: `Yakin ingin delete ${name} ?`,
    color: "red",
    position: "center",
    persistent: true,
    actions: [
      { label: "Ya ", color: "grey-5", handler: () => onDelete(id) },
      { label: "Tidak", color: "white", handler: () => {} },
    ],
  });
};

const onDelete = (id) => {
  studentActivityStore.deleteActivity(id);
};

onBeforeMount(() => {
  studentActivityStore.getAllActivitiesFromServer();
  useComponentStore.onClearSearch;
});
</script>
