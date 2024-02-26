import { defineStore } from "pinia";
import { ref } from "vue";

export const componentStore = defineStore("component", {
  state: () => ({
    counter: 0,
    miniMode: ref(false),
    nextMorphStep: ref({
      btn: "card1",
      card1: "btn",
    }),
    morphGroupModel: ref("btn"),
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    toggleMiniMode() {
      this.miniMode = !this.miniMode;
    },
    nextMorph() {
      console.log("nextMorph");
      this.morphGroupModel = this.nextMorphStep[this.morphGroupModel];
      // console.log(morphGroupModel.value);
    },
  },
});
