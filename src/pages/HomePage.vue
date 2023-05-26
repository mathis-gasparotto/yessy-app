<template>
  <div class="page-container bg-2">
    <q-page class="flex flex-center column page">
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
import { LocalStorage } from 'quasar'

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
    this.user = LocalStorage.getItem('user')
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
