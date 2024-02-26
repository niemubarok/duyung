import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "boot/axios";
import ls from "localstorage-slim";

export const reportStore = defineStore("report", {
  state: () => ({
    totalPendapatan: ref(0),
    pendapatanPerHari: ref(0),
    pendapatanPerBulan: ref(0),
    kunjunganWahanaPerHari: ref(0),
    kunjunganWahanaPerBulan: ref(0),
    totalKunjunganWahana: ref(0),
    totalKunjungan: ref(0),
    kunjunganPerHari: ref(0),
    kunjunganPerBulan: ref(0),
    startDate: ref(),
    endDate: ref(),
    laporanWahana: ref(),
    daftarTransaksi: ref([]),
    totalPendapatanWahana: ref(0),
    totalPendapatanTransaksi: ref(0),
    deleteReason: ref(""),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    async getLaporanPendapatan() {
      try {
        const res = await api.post("reports/pendapatan", {
          startDate: this.startDate,
          endDate: this.endData,
        });
        const pendapatan = res.data;
        console.log(pendapatan);
        // return pendapatan;
        this.totalPendapatan = pendapatan.totalPendapatan;
        this.pendapatanPerHari = pendapatan.pendapatanPerHari;
        this.pendapatanPerBulan = pendapatan.pendapatanPerBulan;
      } catch (err) {
        console.log(err);
      }
    },
    async getLaporanKunjungan() {
      try {
        const res = await api.get("reports/kunjungan");
        this.totalKunjungan = res.data.totalKunjungan;
        // this.kunjunganPerHari = res.data.kunjunganPerHari;
        this.kunjunganPerBulan = res.data.kunjunganPerBulan;
      } catch (err) {
        console.log(err);
      }
    },
    async getLaporanKunjunganWahana(startDate, endDate) {
      try {
        const res = await api.post("reports/wahana", {
          startDate,
          endDate,
        });
        if (res.data) {
          console.log("getLaporanKunjunganWahana", res.data);
          this.totalKunjunganWahana = res.data.totalKunjunganWahana;
          this.kunjunganWahanaPerHari = res.data.kunjunganWahanaPerHari;
          this.kunjunganWahanaPerBulan = res.data.kunjunganWahanaPerBulan;
          this.totalPendapatanWahana = res.data.totalPendapatan;
          this.laporanWahana = res.data.kunjunganWahanaPerHari.sort(
            (a, b) => b.jumlah - a.jumlah
          );
          this.kunjunganPerHari = res.data.kunjunganWahanaPerHari
            .filter(
              (wahana) => wahana.jenis_tiket?.toLowerCase() === "tiket masuk"
            )
            .reduce((total, item) => total + parseInt(item.jumlah), 0);

          console.log("getLaporanKunjungan", startDate);
          console.log("getLaporanKunjungan", endDate);

          // console.log("laporanKunjunganWahana", laporanKunjunganWahana);
          console.log("this.kunjunganPerHari", this.kunjunganPerHari);
          console.log(
            "res.data.kunjunganWahanaPerHari",
            res.data.kunjunganWahanaPerHari
          );
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getLaporanTransaksiFromDB(startDate, endDate) {
      try {
        const res = await api.post("transaksi/all", {
          startDate,
          endDate,
        });
        if (res.data) {
          this.totalPendapatanTransaksi = res.data.reduce(
            (acc, transaksi) => parseInt(acc) + parseInt(transaksi.total_bayar),
            0
          );
          this.daftarTransaksi = res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteTransaksiFromDB(no_transaksi) {
      try {
        const res = await api.post("transaksi/delete", {
          no_transaksi,
          petugas: ls.get("petugas")?.nama,
          keterangan: this.deleteReason,
        });

        console.log(res);

        if (res.status === 200) {
          const index = this.daftarTransaksi.findIndex(
            (transaksi) => transaksi.no_transaksi === no_transaksi
          );
          if (index !== -1) {
            this.daftarTransaksi.splice(index, 1);
          }

          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
