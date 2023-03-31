import { defineStore } from "pinia";

export const useCounterStore = defineStore("isAuthentiticated", {
  getters: {
    isAuthentiticated() {
      return true;
    },
  },
});
