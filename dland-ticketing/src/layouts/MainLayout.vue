<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-6">
    <q-header v-if="$route.meta.requireHeader" class="bg-brown-8">
      <q-toolbar class="q-py-xs">
        <q-btn
          v-if="$route.meta.requireSideNav"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        >
        </q-btn>
        <q-btn
          v-else
          flat
          dense
          round
          icon="dashboard"
          aria-label="Menu"
          @click="$router.push('/dashboard')"
        >
        </q-btn>

        <q-toolbar-title>
          <q-img
            src="~/assets/logo-dland.png"
            :width="$q.platform.is.desktop ? '200px' : '100px'"
            spinner-color="primary"
            spinner-size="20px"
        /></q-toolbar-title>

        <div class="text-body text-weight-bolder text-white text-start q-px-md">
          {{ ls.get("petugas")?.nama }}
          <Clock />
        </div>
        <div>
          <q-btn flat color="white" icon="logout" @click="onLogOut"
            ><q-tooltip class="bg-brown-8 text-yellow-7 text-weight-bolder">
              Log Out
            </q-tooltip></q-btn
          >
          <q-btn flat color="white" icon="settings" @click="onClickSettings">
            <q-tooltip class="bg-brown-8 text-yellow-7 text-weight-bolder">
              Settings
            </q-tooltip></q-btn
          >
          <!-- label="Log Out" -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.meta.requireSideNav"
      v-model="leftDrawerOpen"
      :mini="componentStore().miniMode"
      bordered
      show-if-above
      class="bg-grey-4 relative"
    >
      <q-list class="bg-transparent">
        <q-item-label header class="flex justify-between">
          <div>Dashboard</div>
        </q-item-label>
        <!-- <q-btn
          v-if="componentStore().miniMode"
          flat
          dense
          icon="menu"
          aria-label="Menu"
          @click="componentStore().toggleMiniMode()"
          class="full-width"
        /> -->

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-btn
        flat
        dense
        :icon="componentStore().miniMode ? 'chevron_right' : 'chevron_left'"
        aria-label="Menu"
        @click="componentStore().toggleMiniMode()"
        class="absolute-bottom-right q-mb-lg z-top"
      />

      <div v-if="!componentStore().miniMode" class="absolute-bottom q-ml-sm">
        Copyright © {{ new Date().getFullYear() }} TABAROKTA.
      </div>
    </q-drawer>

    <q-page-container class="full-width">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref, onMounted, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { componentStore } from "src/stores/component-store";
import { userStore } from "src/stores/user-store";
import { useQuasar } from "quasar";
import SettingsDialog from "src/components/SettingsDialog.vue";
import ls from "localstorage-slim";
import Clock from "src/components/Clock.vue";
// import LoginDialog from "src/components/LoginDialog.vue";

const $q = useQuasar();
const handleKeyDown = (event) => {
      //event.preventDefault();

   if (event.key === "Enter" || event.key === "enter") {
    event.preventDefault();
    return
  }
};

const isLoginDialog = computed(()=>userStore().isLoginDialog)


onMounted(() => {
  //console.log("isLoginDialog", isLoginDialog)
  //if(isLoginDialog.value === false){
  window.addEventListener("keydown", handleKeyDown);
  //}
  if (!ls.get("APIURL") || !ls.get("namaPrinter")) {
    const settingDialog = $q.dialog({
      component: SettingsDialog,
      persistent: true,
    });
    settingDialog.update();
  }
});
const onLogOut = () => {
  ls.remove("petugas");
  window.location.reload();
};

const essentialLinks = [
  {
    title: "Dashboard",
    caption: "",
    icon: "dashboard",
    to: "/dashboard",
  },
  {
    title: "Ticketing",
    caption: "",
    icon: "receipt",
    to: "/",
  },

  {
    title: "Laporan Tiket",
    caption: "",
    icon: "bar_chart",
    link: "/laporan/penjualan-tiket",
  },
  {
    title: "Data Transaksi",
    caption: "",
    icon: "fact_check",
    link: "/laporan/transaksi",
  },
  {
    title: "Petugas",
    caption: "",
    icon: "person",
    link: "/petugas",
  },
  {
    title: "Master Wahana",
    caption: "",
    icon: "apps",
    link: "/wahana",
  },
  {
    title: "Daftar Paket",
    caption: "",
    icon: "dataset",
    link: "/paket",
  },
];
const leftDrawerOpen = ref(false);

// essentialLinks: linksList,
// leftDrawerOpen

const onClickSettings = () => {
  const settingDialog = $q.dialog({
    component: SettingsDialog,
    componentProps: {
      closeButton: true,
    },
  });
  settingDialog.update();
};
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleMiniDrawer = () => {
  mini.value = !mini.value;
};
// };
</script>
