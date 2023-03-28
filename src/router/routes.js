const routes = [
  {
    path: "/",
    middleware: "guest",
    children: [
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    middleware: "auth",
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "account",
        component: () => import("pages/AccountPage.vue"),
      },
      {
        path: "bets/",
        children: [
          {
            path: "public",
            component: () => import("src/pages/Bets/PublicBetsPage.vue"),
          },
          {
            path: "create",
            component: () => import("src/pages/Bets/CreateBetPage.vue"),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
