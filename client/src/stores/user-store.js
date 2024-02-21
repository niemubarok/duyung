import { defineStore } from "pinia";
import ls from "localstorage-slim";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { Notify } from "quasar";

export const userStore = defineStore("user", {
  state: () => ({
    counter: 0,
    isLogin: ref(false),
    daftarPetugas: ref([]),
    isLoginDialog:ref(false)
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    async getAllPetugas() {
      const res = await api.get("petugas/all");

      // console.log(res.data);
      this.daftarPetugas.splice(0, this.daftarPetugas?.length, ...res.data);
    },
    async login(username, password) {
      try {
        // const lokasiPos = ls.get("lokasiPos")?.value || null;
        const response = await api.post("petugas/login", {
          username: username,
          password: password,
          // id_pos: lokasiPos,
        });
        console.log("response.data di login", response.data)

        // ls.set("timeLogin", response.data.time_login);
        ls.set("petugas", response.data);
        // ls.set("shift", response.data.shift);
        // ls.set("tanggal", response.data.tanggal);
        // const adminLevels = ["0001", "0002", "0003", "0004"];
        // this.isAdmin = adminLevels.includes(response.data.level_pegawai);

        if (response.data.id_petugas) {
          console.log("true");
        }
        this.isLogin = true;
        console.log(response.data);

        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          // Handle 401 error here
          // console.log("Invalid username or password");
          // Notify.create({
          //   type: "negative",
          //   message: "Cek kembali username dan password anda",
          //   position: "top",
          //   timeout: 2000,
          // });
        }
      }
    },
    async logout() {
      const id_petugas = ls.get("pegawai")?.id_pegawai;
      const id_shift = ls.get("shift");
      const pos = ls.get("lokasiPos")?.value;
      const time_login = ls.get("timeLogin");
      const tanggal = ls.get("tanggal");

      try {
        const res = await axios.post(this.API_URL + "/user/logout", {
          id_petugas,
          id_shift,
          pos,
          time_login,
          tanggal,
        });
      } catch (error) {}
    },

    async deleteMasterPetugasFromDB(id) {
      try {
        const res = await api.post("petugas/delete", { id });
        if (res.status === 201) {
          const index = this.daftarPetugas.findIndex(
            (petugas) => petugas.id_petugas === id
          );
          if (index !== -1) {
            this.daftarPetugas.splice(index, 1);
            console.log(`petugas with ID ${id} deleted.`);
          } else {
            console.log(`petugas with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async editMasterPetugasOnDB(id, column, value) {
      // console.log("value", value);
      try {
        const res = await api.post("petugas/edit", { id, column, value });

        if (res.status === 201) {
          const index = this.daftarPetugas.findIndex(
            (petugas) => petugas.id_petugas === id
          );
          if (index !== -1) {
            Object.assign(this.daftarPetugas[index], { [column]: value });
            console.log(
              `petugas with ID ${id} updated:`,
              this.daftarPetugas[index]
            );
          } else {
            console.log(`petugas with ID ${id} not found.`);
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return err;
      }
    },
    async addMasterPetugasToDB(data) {
      try {
        const res = await api.post("petugas/add", data);
        // console.log(res.data);
        if (res.status === 201) {
          this.daftarPetugas.push({
            id_petugas: res.data.id_petugas,
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
  },
});
