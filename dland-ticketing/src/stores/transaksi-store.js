import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "boot/axios";
import ls from "localstorage-slim";
// import { wahanaStore } from "./wahana-store";

export const transaksiStore = defineStore("transaksi", {
  state: () => ({
    counter: 0,
    detailTransaksi: ref([]),
    detailDataTransaksi: ref([]),
    totalTransaksi: ref(0),
    no_transaksi: ref(""),
    qty: ref(1),
    bayar: ref(0),
    diskon: ref(0),
    totalAfterDiskon: ref(0),
    kembalian: ref(0),
    totalBayar: ref(0),
    no_whatsapp: ref(0),
    saldo: ref(),
    isShowPaymentDialog: ref(false),
    isPaket: ref(false),
    idPaket: ref(""),
    daftarTransaksi: ref([]),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    hitungKembalian() {
      this.kembalian = this.bayar - this.totalBayar;
      return this.kembalian;
    },
    incrementQty() {
      this.qty++;
    },
    qty(id) {
      if (this.detailTransaksi.length) {
        return (
          this.detailTransaksi.detailTransaksi.find(
            (data) => data.id_wahana === id
          ).qty || 0
        );
      }
    },
    decreaseQty(id) {
      // console.log(id);
      const wahanaIndex = this.detailTransaksi.findIndex(
        (item) => item.id_wahana === id
      );
      if (wahanaIndex !== -1) {
        const wahana = this.detailTransaksi[wahanaIndex];
        if (wahana.qty > 1) {
          wahana.qty--;
          this.qty = wahana.qty;
          wahana.total_bayar = wahana.tarif * wahana.qty; // Assuming each wahana object has tarifPerQty indicating the price per single quantity
        } else {
          this.detailTransaksi.splice(wahanaIndex, 1);
        }
      }
    },

    addTransaksi(data) {
      const wahana = this.detailTransaksi.find(
        (item) => item.id_wahana === data.id_wahana
      );
      console.log("addTransaksi", data);
      // console.log("addTransaksi", wahana);
      if (wahana) {
        wahana.qty++;
        this.qty = wahana.qty;
        wahana.total_bayar = data.tarif * wahana.qty;
      } else {
        const totalHarga = data.tarif * this.qty;
        const diskon = data.diskon;
        const totalAfterDiskon = parseInt(totalHarga) - parseInt(diskon);
        this.totalBayar = totalHarga;
        this.diskon = diskon;
        this.totalAfterDiskon = totalAfterDiskon;

        this.detailTransaksi.push({
          ...data,
          qty: 1,
          jenis: data.jenis || "",
          total_bayar: data.tarif,
          deskripsi: data.deskripsi || "",
        });
        // console.log("this.detailTransaksi", this.detailTransaksi);
      }
    },

    removeTransaksi(id) {
      const wahanaIndex = this.detailTransaksi.findIndex(
        (item) => item.id_wahana === id
      );
      if (wahanaIndex !== -1) {
        this.detailTransaksi.splice(wahanaIndex, 1);
      }
    },
    resetTransaksi() {
      this.detailTransaksi.splice(0);
      this.diskon = 0;
      this.totalAfterDiskon = 0;
      this.totalBayar = 0;
      this.isPaket = false;
    },
    async insertIntoDB() {
      const status = "1";
      const cara_bayar = "cash";
      const petugas = ls.get("petugas")?.nama;
      let isSuccess = false;

      //  const data= {
      //     cara_bayar,
      //     status,
      //     petugas,
      //     diskon: this.diskon,
      //     totalAfterDiskon: this.totalAfterDiskon,
      //     transaksi: this.detailTransaksi,
      //     total: this.totalBayar,
      //   }

      // console.log("data",data);
      // return

      try {
        if (this.detailTransaksi.length) {
          const  data= {
            cara_bayar,
            status,
            petugas,
            idPaket: this.isPaket ? this.idPaket : null,
            diskon: this.diskon,
            totalAfterDiskon: this.totalAfterDiskon,
            transaksi: this.detailTransaksi,
            total: this.totalBayar,
          }

          console.log("data di insertINTODB", data)



          console.log()
          const response = await api.post("transaksi/create", {
            data: {
              cara_bayar,
              status,
              petugas,
              idPaket: this.isPaket ? this.idPaket : null,
              diskon: this.diskon,
              totalAfterDiskon: this.totalAfterDiskon,
              transaksi: this.detailTransaksi,
              total: this.totalBayar,
            },
          });
          isSuccess = true;
          // this.detailTransaksi.splice(0);
          console.log("insertIntoDB", response);
          this.no_transaksi = response.data.no_transaksi;
          const no_transaksi = response.data.no_transaksi;
          return { isSuccess, no_transaksi };
        }
      } catch (error) {
        isSuccess = false;
        console.error("There was an error!", error);
      }
    },
    async getDetailTransaksi(no_transaksi) {
      const res = await api.post("transaksi/detail", {
        no_transaksi,
      });

      this.detailDataTransaksi.splice(
        0,
        this.detailDataTransaksi.length,
        ...res.data
      );

      return res.data;

      // const data = {
      //   transaksi: transaksiStore().detailTransaksi,
      //   diskon: transaksiStore().diskon,
      //   totalAfterDiskon: transaksiStore().totalAfterDiskon,
      //   totalBayar: transaksiStore().totalBayar,
      //   namaPaket: wahanaStore().namaPaketTerpilih,
      // };
      // console.log(res.data);
    },

    // async getTransaksiFromDB() {
    //   try {
    //     const res = await api.post("transaksi/all", {
    //       startDate: this.startDate,
    //       endDate: this.endDate,
    //     });
    //     if (res.data) {
    //       this.daftarTransaksi = res.data;
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
  },
});
