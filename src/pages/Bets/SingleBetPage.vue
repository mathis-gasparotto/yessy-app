<template>
  <q-page class="flex flex-center column page single-bet">
    <q-list class="single-bet__props">
      <q-item class="single-bet__prop">
        <span class="single-bet__prop-icon-container">
          <img class="single-bet__prop-icon" :src="bet.category.iconPath" >
        </span>
        <p class="single-bet__prop-text">{{ bet.category.title }}</p>
      </q-item>
      <q-item class="single-bet__prop">
        <span class="single-bet__prop-icon-container">
          <img class="single-bet__prop-icon" src="~assets/quasar-logo-vertical.svg" >
        </span>
        <p class="single-bet__prop-text">{{ bet.description }}</p>
      </q-item>
      <q-item class="single-bet__prop" v-if="bet.customReward">
        <span class="single-bet__prop-icon-container">
          <img class="single-bet__prop-icon" src="~assets/quasar-logo-vertical.svg" >
        </span>
        <p class="single-bet__prop-text">{{ bet.customReward }}</p>
      </q-item>
      <q-item class="single-bet__prop" v-else-if="bet.tokenRewardOdd">
        <span class="single-bet__prop-icon-container">
          <img class="single-bet__prop-icon" src="~assets/quasar-logo-vertical.svg" >
        </span>
        <p class="single-bet__prop-text">La quote est de {{ bet.tokenRewardOdd }}</p>
      </q-item>
      <q-item class="single-bet__prop">
        <span class="single-bet__prop-icon-container">
          <img class="single-bet__prop-icon" src="~assets/quasar-logo-vertical.svg" >
        </span>
        <p class="single-bet__prop-text">{{ bet.endAt }}</p>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    console.log(route.params.id)
    return {
      route
    }
  },
  name: 'SingleBetPage',
  components: {
    BetList
  },
  data() {
    return {
      bet: {
        id: 1,
        title: 'Bet 1',
        description: 'Description 1',
        author: {
          id: 1,
          pseudo: 'John Doe',
          avatarPath: '~assets/quasar-logo-vertical.svg'
        },
        category: {
          id: 1,
          title: 'Sport',
          iconPath: '~assets/quasar-logo-vertical.svg'
        },
        customReward: 'Le gagnant obtiendra un skin',
        endAt: '2023-03-11T12:00:00'
      },
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
