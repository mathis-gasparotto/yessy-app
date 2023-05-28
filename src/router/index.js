import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
// import { LocalStorage } from 'quasar'
import { auth } from 'src/boot/firebase'
import { LocalStorage, Notify } from 'quasar'
import { iParticipate } from 'src/services/participationService'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// export default route(function ({ store, ssrContext }) {
export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    if (auth.currentUser) {
      const now = new Date()
      const expirationDate = new Date(auth.currentUser.stsTokenManager.expirationTime)
      if (expirationDate < now) {
        auth.currentUser.getIdToken(true)
      }
    }
    let isAuthenticated = auth.currentUser && LocalStorage.has('user')
    // if (!auth.currentUser && LocalStorage.has('user') && LocalStorage.has('token')) {
    //   auth.verifyIdToken(LocalStorage.getItem('token'))
    //     .then(() => {
    //       isAuthenticated = true
    //     })
    //     .catch((error) => {
    //       LocalStorage.remove('user')
    //     })
    // }
    if (auth.currentUser && !LocalStorage.has('user')) {
      auth.signOut()
    }
    if (!isAuthenticated && to.name !== 'login' && to.name !== 'signup' && to.name !== 'welcome') {
      next({
        name: from.name !== 'login' && from.name !== 'signup' && from.name !== 'welcome' ? 'welcome' : from.name
      })
    } else if (isAuthenticated && (to.name === 'login' || to.name === 'signup' || to.name === 'welcome')) {
      next({
        name: from.name === 'login' || from.name === 'signup' || from.name === 'welcome' ? 'home' : from.name
      })
    } else if (to.name === 'join-bet') {
      iParticipate(to.params.id).then((res) => {
        if (res) {
          Notify.create({
            message: 'Vous participez déjà à ce pari',
            color: 'negative',
            icon: 'report_problem',
            timeout: 3000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          next({ name: 'single-bet', params: { id: to.params.id } })
        } else {
          next()
        }
      })
    } else {
      next()
    }
  })

  return Router
})
