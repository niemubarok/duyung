import { defineStore } from "pinia";

export const chartStore = defineStore("chart", {
  state: () => ({
    kunjunganPerbulan: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Data Kunjungan Per Bulan",
          backgroundColor: "#f87979",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    },
    kunjunganPerMinggu: {
      labels: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
      datasets: [
        {
          label: "Data Kunjungan Per Minggu",
          backgroundColor: "blue",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    },
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});
