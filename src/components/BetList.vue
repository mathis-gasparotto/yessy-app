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
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 2,
          title: 'Bet 2',
          description: 'Description 2',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 3,
          title: 'Bet 3',
          description: 'Description 3',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 4,
          title: 'Bet 4',
          description: 'Description 4',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 5,
          title: 'Bet 5',
          description: 'Description 5',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 6,
          title: 'Bet 6',
          description: 'Description 6',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 7,
          title: 'Bet 7',
          description: 'Description 7',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 8,
          title: 'Bet 8',
          description: 'Description 8',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 9,
          title: 'Bet 9',
          description: 'Description 9',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        },
        {
          id: 10,
          title: 'Bet 10',
          description: 'Description 10',
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '~assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 2,
            title: 'Games',
            iconPath: '~assets/quasar-logo-vertical.svg'
          },
          rewardCustom: 'Le gagnant obtiendra un skin',
          endAt: '2023-03-11T12:00:00'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.bet-list {
  width: 80%;
}
.q-list--separator > .q-item-type {
  border-color: white;
}
</style>
