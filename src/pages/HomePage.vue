<template>
  <div class="page-container bg-2">
    <q-page class="flex flex-center column page">
      <div class="page-content">
        <div class="home-cat-title">
          <h2 class="text-h6">Chauffe toi sur ces paris</h2>
          <span class="underliner"></span>
        </div>
        <BetList class="bet-list-component" />
        <q-btn @click="handleLogout()">Se déconnecter</q-btn>
      </div>
    </q-page>
  </div>
</template>

<script>
import { LocalStorage, Notify } from 'quasar'
import BetList from 'src/components/BetList.vue'
import { logout } from 'src/boot/firebase'
import translate from '../stores/translatting.js'

export default {
  name: 'HomePage',
  components: {
    BetList
  },
  methods: {
    handleLogout() {
      logout().then(() => {
        LocalStorage.remove('user')
        this.$router.push({ name: 'login' })
      }).catch((err) => {
        this.loading = false
        Notify.create({
          message: translate().translateLogoutError(err),
          color: 'negative',
          icon: 'report_problem',
          timeout: 5000
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  justify-content: start;
}
.home {
  &-cat-title {
    position: relative;
    width: 70%;
    margin: auto;
    text-align: center;
    h2 {
      position: relative;
      z-index: 1;
      font-weight: bold;
      display: inline;
    }
    .underliner {
      position: absolute;
      top: 20px;
      left: -10px;
      width: 110%;
      background-color: $secondary;
      height: 12px;
      display: inline-block;
    }
  }
}
</style>
