import { defineStore } from 'pinia'

export const useStore = defineStore('user', {
  state: () => {
    return {
      username: '',
      email: '',
      uid: ''
    }
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
