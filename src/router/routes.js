const routes = [
  {
    path: '/',
    middleware: 'guest',
    component: () => import('layouts/WelcomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'welcome',
        component: () => import('pages/WelcomePage.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('pages/SignupPage.vue')
      }
    ]
  },
  {
    path: '/',
    middleware: 'auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/HomePage.vue')
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('pages/AccountPage.vue')
      },
      {
        path: 'bets/',
        name: 'bets',
        children: [
          {
            path: '',
            name: 'public-bets',
            component: () => import('src/pages/Bets/PublicBetsPage.vue')
          },
          {
            path: 'add',
            name: 'add-bets',
            component: () => import('src/pages/Bets/AddBetPage.vue')
          },
          {
            path: 'join/:id',
            name: 'join-bet',
            component: () => import('src/pages/Bets/JoinBetPage.vue')
          },
          {
            path: 'define-winner-choice/:id',
            name: 'define-winner-choice',
            component: () => import('src/pages/Bets/DefineWinnerChoicePage.vue')
          },
          {
            path: ':id',
            name: 'single-bet',
            component: () => import('src/pages/Bets/SingleBetPage.vue')
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
