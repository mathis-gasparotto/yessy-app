import { defineStore } from 'pinia'

export const useStore = defineStore('user', {
  state: () => {
    // FirebaseAuth.getInstance().getCurrentUser().getEmail()
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
