import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  getters: {
    isAuthentiticated() {
      return false;
    },
  },
});
