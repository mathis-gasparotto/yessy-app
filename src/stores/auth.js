import { defineStore } from "pinia";

export const useIsAuthenticatedStore = defineStore('isAuthenticated', {
  state: () => true,
  actions: {
    login() {
      this = true
    },
    disconnect() {
      this = false
    },
  },
})
