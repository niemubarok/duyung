import { defineStore } from "pinia";
import { api } from "boot/axios";
import { ref } from "vue";
import { transaksiStore } from "./transaksi-store";

export const wahanaStore = defineStore("wahana", {
  state: () => ({
    // daftarWahana: [
    //   {
    //     id: 1,
    //     name: "Ticket Masuk",
    //     tarif: 0,
    //   },
    //   {
    //     id: 2,
    //     name: "Rainbow Slide",
    //     tarif: 15000,
    //   },
    //   {
    //     id: 3,
    //     name: "Kora Kora",
    //     tarif: 20000,
    //   },
    //   {
    //     id: 4,
    //     name: "Kincir Angin",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 5,
    //     name: "Ontang Anting",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 6,
    //     name: "Kuda Putar",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 7,
    //     name: "Bom Bom Car",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 8,
    //     name: "Wahana 8",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 9,
    //     name: "Wahana 9",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 10,
    //     name: "Wahana 10",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 11,
    //     name: "Wahana 11",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 12,
    //     name: "Wahana 12",
    //     tarif: 10000,
    //   },
    //   {
    //     id: 13,
    //     name: "Wahana 13",
    //     tarif: 10000,
    //   },
    // ],

    daftarWahana: ref([]),
    paket: ref([
      // {
      //   idPaket: 1,
      //   namaPaket: "Paket Terusan",
      //   hargaPaket: 75000,
      //   diskon: 35000,
      //   status: true,
      //   idWahana: [0, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      // },
      // {
      //   idPaket: 3,
      //   namaPaket: "Paket Anak A",
      //   hargaPaket: 65000,
      //   diskon: 0,
      //   status: true,
      //   idWahana: [5, 12, 8],
      // },
      // {
      //   idPaket: 4,
      //   namaPaket: "Paket Anak B",
      //   hargaPaket: 65000,
      //   diskon: 5000,
      //   status: true,
      //   idWahana: [13, 6, 10, 11],
      // },
    ]),
    detailPaket: ref([]),
    jenisTiket: ref([]),
    namaPaketTerpilih: ref(""),
    jumlahWahana: ref(0),
  }),

  // getters: {
  //   doubleCount(state) {
  //     return state.counter * 2;
  //   },
  // },

  actions: {
    async getWahanaFromDB() {
      const res = await api.get("wahana");
      this.daftarWahana.splice(0, this.daftarWahana.length, ...res.data);
      this.jumlahWahana = res.data?.length;
      console.log("getWahanaFromDBr", res.data);
      return res.data;
    },

    async getDetailPaketFromDB() {
      const res = await api.get("paket/detail");
      this.detailPaket.splice(0, this.paket.length, ...res.data);
      console.log(res.data);
      return res.data;
    },
    async getJenisTiketFromDB() {
      try {
        const res = await api.get("wahana/jenis-tiket");
        if (res.status === 200 && Array.isArray(res.data)) {
          this.jenisTiket = res.data.map((jenis) => ({
            id: jenis.id_jenis,
            label: jenis.nama_jenis,
          }));
        } else {
          console.error("Failed to fetch jenis tiket, status:", res.status);
        }
      } catch (error) {
        console.error("Error fetching jenis tiket:", error);
      }
    },
    pilihPaket(paket, daftarWahana) {
      // Mendapatkan array wahana yang sesuai dengan paket dari daftarWahana
      const wahanaTerpilih = daftarWahana.filter((wahana) =>
        paket.idWahana?.includes(wahana.id_wahana)
      );
      // console.log(daftarWahana);
      // return;

      this.namaPaketTerpilih = paket.namaPaket;

      console.log("paket", paket);

      // Menghitung total harga tiket untuk paket
      const totalHarga = wahanaTerpilih.reduce(
        (total, wahana) => total + parseFloat(wahana.harga_tiket),
        0
      );

      // Menentukan diskon
      const diskon = paket.diskon;
      const totalAfterDiskon = parseInt(totalHarga) - parseInt(diskon);
      transaksiStore().totalBayar = totalHarga;
      transaksiStore().diskon = diskon;
      transaksiStore().totalAfterDiskon = totalAfterDiskon;

      // Menentukan status (misalnya, status selalu true)
      const status = true;

      // Membuat objek paket
      // const paketObj = {
      //   idPaket: 2,
      //   namaPaket: "Paket Terusan (WeekDay)",
      //   hargaPaket: totalHarga,
      //   diskon: diskon,
      //   status: status,
      //   idWahana: paket,
      // };

      // Membuat array detail transaksi berdasarkan wahana terpilih
      const pushWahana = wahanaTerpilih.map((wahana) => {
        return {
          id_wahana: wahana.id_wahana.toString(),
          nama: wahana.nama,
          jenis: wahana.nama_jenis,
          deskripsi: wahana.deskripsi,
          tarif: parseFloat(wahana.harga_tiket),
          total_bayar: parseFloat(wahana.harga_tiket),
          qty: 1,
        };
      });

      //  console.log(pushWahana)
      //  return

      transaksiStore().detailTransaksi.push(...pushWahana);
      console.log(transaksiStore().detailTransaksi);
      return;

      // return {
      //   paket: paket,
      //   detailTransaksi: detailTransaksi,
      // };
    },

    async getPaketFromDB() {
      const res = await api.get("paket/detail");

      const data = res.data.map((item) => {
        return {
          idPaket: item.idPaket,
          namaPaket: item.namaPaket,
          hargaPaket: parseInt(item.hargaPaket),
          diskon: parseInt(item.diskon),
          jenisPaket: item.jenisPaket,
          deskripsi: item.deskripsi,
          status: item.status,
          idWahana: [...item.idWahana],
        };
      });

      this.paket.splice(0, this.paket.length, ...data);

      // console.log("res.data", res.data);
      // console.log(data);
    },
    async addPaketToDB(data) {
      console.log("data", data);
      try {
        const res = await api.post("/paket/create", { data });
        if (res.status === 201) {
          const dataToPush = {
            idPaket: data.id_paket,
            namaPaket: data.nama_paket,
            hargaPaket: parseInt(data.harga_paket),
            diskon: parseInt(data.diskon),
            jenisPaket: data.jenis_paket,
            deskripsi: data.deskripsi,
            status: data.status,
            idWahana: [...data.id_wahana],
          };

          this.paket.push(dataToPush);
          console.log("Paket added:", dataToPush);
          return true;
        } else {
          console.error("Failed to add paket:", res);
          return false;
        }
      } catch (error) {
        console.error("Error adding paket:", error);
      }
    },
    async addMasterWahanaToDB(data) {
      try {
        const res = await api.post("wahana/add", data);
        // console.log(res.data);
        if (res.status === 201) {
          this.daftarWahana.push({
            id_wahana: res.data.id_wahana.id_wahana,
            ...data,
          });
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async editMasterWahanaOnDB(id, column, value) {
      // console.log("value", value);
      try {
        const res = await api.post("wahana/edit", { id, column, value });

        if (res.status === 201) {
          const index = this.daftarWahana.findIndex(
            (wahana) => wahana.id_wahana === id
          );
          if (index !== -1) {
            Object.assign(this.daftarWahana[index], { [column]: value });
            console.log(
              `Wahana with ID ${id} updated:`,
              this.daftarWahana[index]
            );
          } else {
            console.log(`Wahana with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async editJenisTiketOnDB(id, column, value) {
      try {
        console.log("value.column", column);
        const id_jenis = value.id;
        const res = await api.post("wahana/edit", {
          id,
          column,
          value: id_jenis,
        });

        if (res.status === 201) {
          const index = this.daftarWahana.findIndex(
            (wahana) => wahana.id_wahana === id
          );
          if (index !== -1) {
            Object.assign(this.daftarWahana[index], {
              nama_jenis: value.label,
            });
            console.log(
              `Wahana with ID ${id} updated:`,
              this.daftarWahana[index]
            );
          } else {
            console.log(`Wahana with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async deleteMasterWahanaFromDB(id) {
      try {
        const res = await api.post("wahana/delete", { id });
        if (res.status === 201) {
          const index = this.daftarWahana.findIndex(
            (wahana) => wahana.id_wahana === id
          );
          if (index !== -1) {
            this.daftarWahana.splice(index, 1);
            console.log(`Wahana with ID ${id} deleted.`);
          } else {
            console.log(`Wahana with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async editPaketOnDB(id, column, value) {
      try {
        const res = await api.post("paket/edit", { id, column, value });

        if (res.status === 201) {
          const index = this.paket.findIndex((paket) => paket.id_paket === id);
          if (index !== -1) {
            Object.assign(this.paket[index], { [column]: value });
            console.log(`paket with ID ${id} updated:`, this.paket[index]);
          } else {
            console.log(`paket with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async deletePaketFromDB(id) {
      try {
        const res = await api.post("paket/delete", { id });
        if (res.status === 201) {
          const index = this.paket.findIndex((paket) => paket.idPaket === id);
          if (index !== -1) {
            this.paket.splice(index, 1);
            console.log(`paket with ID ${id} deleted.`);
          } else {
            console.log(`paket with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
  },
});
