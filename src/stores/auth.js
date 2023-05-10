import { defineStore } from 'pinia'

export const useStore = defineStore('user', {
  state: () => {
    username: 'Test'
  },
  actions: {
    login(user) {
      this = user
    },
    disconnect() {
      this = {}
    }
  }
})
