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

    <q-footer class="nav-bar-container">
      <q-tabs align="center" class="bg-dark nav-bar" indicator-color="transparent" active-color="secondary" >
        <q-route-tab :to="{ name: 'home' }" icon="home" label="Accueil" />
        <q-route-tab :to="{ name: 'public-bets' }" icon="fa fa-trophy" label="Paris" />
        <!-- <q-route-tab :to="{name: 'friends'}" label="Amis" /> -->
        <!-- <q-route-tab :to="{name: 'shop'}" label="Boutique" /> -->
        <q-route-tab :to="{ name: 'account' }" icon="account_circle" label="Compte" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<style lang="scss" scoped>
.nav-bar {
  border-radius: 20px 20px 0 0;
  &-container {
    background-color: transparent;
    .q-tab {
      flex: 1 1 auto;
      &__label {
        font-size: 16px;
        font-weight: 300;
      }
    }
  }
}
</style>
