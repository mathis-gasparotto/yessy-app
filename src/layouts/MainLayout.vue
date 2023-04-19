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
        <q-route-tab :to="{name: 'home'}" label="Accueil" />
        <q-route-tab :to="{name: 'public-bets'}" label="Paris" />
        <q-route-tab :to="{name: 'create-bets'}" label="Créer un pari" />
        <!-- <q-route-tab :to="{name: 'friends'}" label="Amis" /> -->
        <q-route-tab :to="{name: 'account'}" label="Compte" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
}
</script>
