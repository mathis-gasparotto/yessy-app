import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
// import { LocalStorage } from 'quasar'
import { auth, getCurrentUser } from 'src/boot/firebase'
import { LocalStorage, Notify } from 'quasar'
import { iParticipate } from 'src/services/participationService'
import { getJustBet, isAuthor } from 'src/services/betService'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/*{ store, ssrContext }*/ { store }) {
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

  Router.beforeEach(async(to, from, next) => {
    const currentUser = await getCurrentUser()

    if (currentUser) {
      const now = new Date()
      const expirationDate = new Date(currentUser.stsTokenManager.expirationTime)
      if (expirationDate < now) {
        currentUser.getIdToken(true)
      }
    }
    // if (!currentUser && LocalStorage.has('user') && LocalStorage.has('token')) {
    //   auth.verifyIdToken(LocalStorage.getItem('token'))
    //     .then(() => {
    //       isAuthenticated = true
    //     })
    //     .catch((error) => {
    //       LocalStorage.remove('user')
    //     })
    // }
    let isAuthenticated = currentUser && LocalStorage.has('user')
    if (currentUser && !LocalStorage.has('user')) {
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
    // } else if (isAuthenticated && to.name === 'join-bet') {
    //   const iParticipateRes = await iParticipate(to.params.id).catch(() => {
    //     Notify.create({
    //       message: 'Une erreur est survenue',
    //       color: 'negative',
    //       icon: 'report_problem',
    //       position: 'top',
    //       timeout: 3000,
    //       actions: [
    //         {
    //           icon: 'close',
    //           color: 'white'
    //         }
    //       ]
    //     })
    //     return next({ name: 'single-bet', params: { id: to.params.id } })
    //   })
    //   if (iParticipateRes) {
    //     Notify.create({
    //       message: 'Vous participez déjà à ce pari',
    //       color: 'negative',
    //       icon: 'report_problem',
    //       position: 'top',
    //       timeout: 3000,
    //       actions: [
    //         {
    //           icon: 'close',
    //           color: 'white'
    //         }
    //       ]
    //     })
    //     return next({ name: 'single-bet', params: { id: to.params.id } })
    //   } else {
    //     const isAuthorRes = await isAuthor(to.params.id).catch(() => {
    //       Notify.create({
    //         message: 'Une erreur est survenue',
    //         color: 'negative',
    //         icon: 'report_problem',
    //         position: 'top',
    //         timeout: 3000,
    //         actions: [
    //           {
    //             icon: 'close',
    //             color: 'white'
    //           }
    //         ]
    //       })
    //       return next({ name: 'single-bet', params: { id: to.params.id } })
    //     })
    //     if (isAuthorRes) {
    //       Notify.create({
    //         message: 'Vous ne pouvez pas participer à votre propre pari',
    //         color: 'negative',
    //         icon: 'report_problem',
    //         position: 'top',
    //         timeout: 3000,
    //         actions: [
    //           {
    //             icon: 'close',
    //             color: 'white'
    //           }
    //         ]
    //       })
    //       return next({ name: 'single-bet', params: { id: to.params.id } })
    //     } else {
    //       return next()
    //     }
    //   }
    } else if (isAuthenticated && to.name === 'define-winner-choice') {
      const isAuthroRes = await isAuthor(to.params.id).catch(() => {
        Notify.create({
          message: 'Une erreur est survenue',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'single-bet', params: { id: to.params.id } })
      })
      if (!isAuthroRes) {
        Notify.create({
          message: 'Vous na pas accès à cette page',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'single-bet', params: { id: to.params.id } })
      }
      const bet = await getJustBet(to.params.id).catch(() => {
        Notify.create({
          message: 'Une erreur est survenue lors de la récupération du pari',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'single-bet', params: { id: to.params.id } })
      })
      if (bet.winnerChoice) {
        Notify.create({
          message: 'Le choix gagnant de ce pari a déjà été défini',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'single-bet', params: { id: to.params.id } })
      } else if (bet.disabled) {
        Notify.create({
          message: 'Vous ne pouvez pas définir le gagnant d\'un pari annulé',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'single-bet', params: { id: to.params.id } })
      } else {
        return next()
      }
    } else if (isAuthenticated && to.name === 'join-hebdo-bet') {
      const bet = await getJustBet(to.params.id, 'hebdo_bets').catch(() => {
        Notify.create({
          message: 'Une erreur est survenue lors de la récupération du pari',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'home' })
      })
      const now = new Date()
      if (bet.endAt.seconds * 1000 <= now.getTime()) {
        Notify.create({
          message: 'Ce pari est déjà terminé',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'home' })
      } else if (bet.startAt.seconds * 1000 > now.getTime()) {
        Notify.create({
          message: 'Ce pari n\'a pas encore commencé',
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
        return next({ name: 'home' })
      } else {
        return next()
      }
    } else {
      return next()
    }
  })

  return Router
})
