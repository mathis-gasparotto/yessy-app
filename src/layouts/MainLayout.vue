<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Yessy
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-tabs align="center">
        <q-route-tab to="/" label="Accueil" />
        <q-route-tab to="/bets/public" label="Paris" />
        <q-route-tab to="/bets/create" label="Créer un pari" />
        <!-- <q-route-tab to="/friends" label="Amis" /> -->
        <q-route-tab to="/account" label="Compte" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
}
</script>
