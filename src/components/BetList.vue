<template>
  <q-list separator class="bet-list">
    <BetItem
      v-for="bet in bets"
      :key="bet.id"
      :item="bet"
    />
  </q-list>
</template>

<script>
import BetItem from './BetItem.vue'

export default {
  name: 'BetList',
  components: {
    BetItem
  },
  data() {
    return {
      bets: [
        {
          id: 1,
          title: 'Bet 1',
          description: 'Description 1',
          category: {
            id: 1,
            title: 'Sport',
            iconPath: '~assets/quasar-logo-vertical.svg'
          }
        },
        {
          id: 2,
          title: 'Bet 2',
          description: 'Description 2',
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          }
        },
        {
          id: 3,
          title: 'Bet 3',
          description: 'Description 3',
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          }
        },
        {
          id: 4,
          title: 'Bet 4',
          description: 'Description 4',
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          }
        },
        {
          id: 5,
          title: 'Bet 5',
          description: 'Description 5',
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.bet-list {
  width: 100%;
}
</style>
