<template>
  <div class="page-container bg-2">
    <q-page class="flex flex-center column page" v-if="user">
      <div class="page-content">
        <div class="home__user-container flex q-my-md">
          <div class="home__user-avatar-container">
            <q-img class="home__user-avatar" :src="user.avatar.imgUrl" />
          </div>
          <div class="home__user-text">
            <div class="home__user-username text-bold">{{ user.username }}</div>
            <div class="home__user-token-count text-bold text-secondary">
              <q-icon name="fa fa-coins"></q-icon>
              {{ user.tokenCount }}
            </div>
          </div>
        </div>
        <div class="home-cat-title q-my-lg">
          <h2 class="text-h6">Chauffe toi sur ces paris</h2>
        </div>
        <BetList class="bet-list-component" />
      </div>
    </q-page>
  </div>
</template>

<script>
import BetList from 'src/components/BetList.vue'
import { Loading, LocalStorage, Notify } from 'quasar'
import { getUser } from 'src/services/userService'
import { auth } from 'src/boot/firebase'

export default {
  name: 'HomePage',
  components: {
    BetList
  },
  data () {
    return {
      user: null
    }
  },
  created () {
    this.reloadData()
  },
  methods: {
    async reloadData() {
      Loading.show()
      getUser(auth.currentUser.uid)
        .then((user) => {
          LocalStorage.set('user', user)
          this.user = user
          Loading.hide()
        })
        .catch((e) => {
          Notify.create({
            message: 'Une erreur est survenue',
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
          Loading.hide()
          throw new Error(e.message)
        })
    },
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
    &-avatar {
      width: 70px;
      height: 70px;
    }
  }
  &-cat-title {
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
