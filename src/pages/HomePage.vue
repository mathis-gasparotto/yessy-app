<template>
  <div class="page-container bg-2">
    <q-page class="flex flex-center column page" v-if="user">
      <div class="page-content">
        <div class="home__user-container flex q-my-md">
          <q-avatar class="home__user-avatar-container" size="70px">
            <q-img class="home__user-avatar" :src="user.avatar.imgUrl" />
          </q-avatar>
          <div class="home__user-text">
            <div class="home__user-username text-bold">{{ formatting.maxStringLenght(user.username, 20) }}</div>
            <div class="home__user-token-count text-bold text-secondary flex items-center">
              <q-icon name="fa fa-coins"></q-icon>
              <q-spinner-gears size="1.5rem" color="secondary" v-if="loadingWallet" />
              <span v-else>{{ userWallet }}</span>
            </div>
          </div>
        </div>
        <div class="home__hebdo-bet-container bg-primary q-my-md q-py-sm q-px-md" v-if="hebdoBet" @click="$router.push({ name: 'join-hebdo-bet', params: {id : this.hebdoBet.id} })">
          <p class="home__hebdo-bet-title text-white text-h6 text-bold q-mb-0">Pronostic de la semaine :</p>
          <p class="home__hebdo-bet-label text-white q-mb-0">{{ hebdoBet.label }}</p>
        </div>
        <div class="home__cat-title q-my-lg">
          <h2 class="text-h6">Chauffe toi sur ces paris</h2>
        </div>
        <BetList class="bet-list-component" />
      </div>
    </q-page>
  </div>
</template>

<script>
import BetList from 'src/components/BetList.vue'
import { /*Loading,*/ LocalStorage, Notify } from 'quasar'
import { getUser } from 'src/services/userService'
import { auth } from 'src/boot/firebase'
import { getMyWallet } from 'src/services/tokenTransactionService'
import { getHebdoBet } from 'src/services/betService'
import formatting from 'src/stores/formatting'

export default {
  name: 'HomePage',
  components: {
    BetList
  },
  data() {
    return {
      user: null,
      userWallet: null,
      loadingWallet: true,
      hebdoBet: null,
      formatting: formatting()
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    async reloadData() {
      // Loading.show()
      this.loadingWallet = true
      await getUser(auth.currentUser.uid)
        .then((user) => {
          LocalStorage.set('user', user)
          this.user = user
        })
        .catch((e) => {
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
          // Loading.hide()
          this.loadingWallet = false
          throw new Error(e.message)
        })

      await getMyWallet()
        .then((wallet) => {
          this.userWallet = wallet
          // Loading.hide()
          this.loadingWallet = false
        })
        .catch((e) => {
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
          // Loading.hide()
          this.loadingWallet = false
          throw new Error(e.message)
        })

        this.hebdoBet = await getHebdoBet()
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  justify-content: start;
}

.home {
  &__user {
    &-container {
      gap: 10px;
    }
    // &-avatar {
    //   width: 70px;
    //   height: 70px;
    // }
    &-token-count {
      gap: 3px;
    }
  }
  &__hebdo-bet {
    &-container {
      border-radius: 10px;
    }
    &-title {
      line-height: 1.5;
    }
    &-label {
      font-size: .9rem;
      font-weight: 300;
    }
  }
  &__cat-title {
    position: relative;
    text-align: center;

    h2 {
      position: relative;
      z-index: 1;
      font-weight: bold;
      display: inline;

      &::after {
        content: '';
        position: absolute;
        z-index: -1;
        bottom: -5px;
        left: -10px;
        width: calc(100% + 20px);
        height: 12px;
        background-color: $secondary;
      }
    }
  }
}
</style>
