import { defineStore } from "pinia";
import { ref } from "vue";
import ls from "localstorage-slim";
import axios from "axios";

export const settingsStore = defineStore("settings", {
  state: () => ({
    API_URL: ref(ls.get("API_URL")) || "-",
    prefix: ref(ls.get("prefix") || "-"),
    posConfig: ref([]),
    logo: ref([]),
    isLicenseExpired: ref(false),
    pesan: ref([]),
    companyName: ref(""),
    namaPrinter: ref(ls.get("namaPrinter")),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    // async loadSettings() {
    //   const res = await axios.get(this.API_URL + "/settings/soft-setting");
    //   // console.log(res.data);
    //   const [data] = res.data;
    //   // const logo = btoa(
    //   //   String.fromCharCode.apply(null, new Uint8Array(data.logo.data))
    //   // );
    //   // // console.log(logo);
    //   // // if (pic.rows && pic.rows.length > 0) {
    //   // const contentType = logo.startsWith("data:image/png") ? "png" : "jpeg";
    //   // if (logo.startsWith("data:image")) {
    //   //   this.logo = logo;
    //   // } else {
    //   //   this.logo = `data:image/${contentType};base64,` + logo;
    //   // }
    //   // }
    //   this.isLicenseExpired = data.lisensi === 1 ? false : true;
    //   this.companyName = data.namalokasi;
    //   ls.set("companyName", this.companyName);
    //   // console.log(this.logo);
    //   return data;
    // },
    // async getPosConfig() {
    //   try {
    //     const response = await axios.post(
    //       this.API_URL + "/settings/config-pos",
    //       {
    //         id_pos: ls.get("lokasiPos").value,
    //       }
    //     );
    //     console.log(response.data);
    //     this.prefix = Array.isArray(response.data)
    //       ? response.data[0].prefix
    //       : response.data.prefix;
    //     ls.set("prefix", this.prefix);
    //     this.posConfig = response.data;
    //   } catch (error) {}
    // },
    // async getLogo() {
    //   const res = await axios.get(this.API_URL + "/settings/logo");
    //   const logo = res.data;
    //   // const logo = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
    //   // console.log(logo);
    //   const contentType = logo.startsWith("data:image/png") ? "png" : "jpeg";
    //   if (logo.startsWith("data:image")) {
    //     this.logo = logo;
    //   } else {
    //     this.logo = `data:image/${contentType};base64,` + logo;
    //   }
    //   // console.log(this.logo);
    // },
    // async getPesan() {
    //   const res = await axios.get(this.API_URL + "/settings/pesan");
    //   const data = res.data;
    //   this.pesan = Object.values(data).map((item) => item.pesan);
    // },
    // async getSnapshot() {
    //   // const res = await axios(this.API_URL + "/settings/camera");
    //   // const img = res.data;
    //   // const contentType = img.startsWith("data:image/png") ? "png" : "jpeg";
    //   // if (img.startsWith("data:image")) {
    //   //   return img;
    //   // } else {
    //   //   return `data:image/${contentType};base64,` + img;
    //   // }
    //   // const logo = atob(
    //   //   String.fromCharCode.apply(null, new Uint8Array(res.data))
    //   // );
    //   // return res.data;
    //   // console.log(logo);
    //   // let blob = new Blob([res.data], {
    //   //   type: "image/octet-stream",
    //   // });
    //   // const img = URL.createObjectURL(blob);
    //   // console.log(img);
    //   // return logo;
    //   // console.log(this.logo);
    // },
  },
});
