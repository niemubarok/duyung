const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/dashboard",
        component: () => import("pages/dashboardPage.vue"),
        meta: {
          requireHeader: true,
          requireSideNav: true,
          requireAuth: true,
        },
      },
      {
        path: "",
        meta: {
          requireHeader: true,
          requireSideNav: false,
        },
        component: () => import("pages/TicketingPage.vue"),
      },
      {
        path: "/laporan/transaksi",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/LaporanTransaksiPage.vue"),
      },
      {
        path: "/qrcode",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/QrScannerPage.vue"),
      },
      // {
      //   path: "/print",
      //   meta: {
      //     requireHeader: false,
      //     requireSideNav: false,
      //   },
      //   component: () => import("pages/PrintPage.vue"),
      // },
      {
        path: "/petugas",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/PetugasPage.vue"),
      },
      {
        path: "/wahana",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/MasterWahanaPage.vue"),
      },
      {
        path: "/paket",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/DaftarPaketPage.vue"),
      },
      {
        path: "/laporan/penjualan-tiket",
        meta: {
          requireHeader: true,
          requireSideNav: true,
        },
        component: () => import("pages/LaporanKunjunganPerWahanaPage.vue"),
      },
      {
        path: "/print",
        meta: {
          requireHeader: false,
          requireSideNav: false,
        },
        component: () => import("pages/TestPrint.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
