// import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
// import { login } from 'src/boot/firebase'
// import { createStore } from 'vuex'

export default {
  namespaced: true,
  state: () => ({
    user: {
      loggedIn: false,
      data: null
    }
  }),
  getters: {
    user(state) {
      return state.user.data
    },
    isLoggedIn(state) {
      return state.user.loggedIn
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value
    },
    SET_USER(state, data) {
      state.user.data = data
    }
  },
  // actions: {
  //   async register(context, { email, password, name }) {
  //     const response = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     )
  //     if (response) {
  //       context.commit('SET_USER', response.user)
  //       response.user.updateProfile({ displayName: name })
  //     } else {
  //       throw new Error('Unable to register user')
  //     }
  //   },

  //   signIn(context, { email, password }) {
  //     return login(email, password).then((user) => {
  //       this.loading = false
  //       context.commit('SET_LOGGED_IN', true)
  //       context.commit('SET_USER', {
  //         username: this.username,
  //         birthday: this.birthday,
  //         email: this.email,
  //         referralCode: this.referralCode,
  //         minAgeCheck: this.minAgeCheck,
  //         newsletterCheck: this.newsletterCheck
  //       })
  //       return user
  //     }).catch((err) => {
  //       throw new Error(err.message)
  //     })
  //   },

  //   async logOut(context) {
  //     await signOut(auth)
  //     context.commit('SET_USER', null)
  //   },

  //   async fetchUser(context, user) {
  //     context.commit('SET_LOGGED_IN', user !== null)
  //     if (user) {
  //       context.commit('SET_USER', {
  //         displayName: user.displayName,
  //         email: user.email
  //       })
  //     } else {
  //       context.commit('SET_USER', null)
  //     }
  //   }
  // }
}
