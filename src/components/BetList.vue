<template>
  <q-list separator class="bet-list" v-if="!loadingBets || loadingBetsProp === false">
    <BetItem
      v-for="bet in betList"
      :key="bet.id"
      :item="bet"
    />
  </q-list>
</template>

<script>
import { Loading } from 'quasar'
import BetItem from './BetItem.vue'
import { getBets } from 'src/boot/firebase'

export default {
  name: 'BetList',
  components: {
    BetItem
  },
  props: {
    bets: {
      type: Array,
      required: false
    },
    loadingBetsProp: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      // bets: [
      //   {
      //     id: 1,
      //     title: 'Bet 1',
      //     description: 'Description 1',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 1,
      //       title: 'Sport',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 2,
      //     title: 'Bet 2',
      //     description: 'Description 2',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 3,
      //     title: 'Bet 3',
      //     description: 'Description 3',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 4,
      //     title: 'Bet 4',
      //     description: 'Description 4',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 5,
      //     title: 'Bet 5',
      //     description: 'Description 5',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 6,
      //     title: 'Bet 6',
      //     description: 'Description 6',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 7,
      //     title: 'Bet 7',
      //     description: 'Description 7',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 8,
      //     title: 'Bet 8',
      //     description: 'Description 8',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 9,
      //     title: 'Bet 9',
      //     description: 'Description 9',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   },
      //   {
      //     id: 10,
      //     title: 'Bet 10',
      //     description: 'Description 10',
      //     privacy: 'public',
      //     author: {
      //       id: 1,
      //       pseudo: 'John Doe',
      //       avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     category: {
      //       id: 2,
      //       title: 'Games',
      //       iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //     },
      //     rewardCustom: 'Le gagnant obtiendra un skin',
      //     endAt: '2023-03-11T12:00:00'
      //   }
      // ]
      betList: null,
      loadingBets: true
    }
  },
  created () {
    if (this.bets) {
      console.log('oui')
      this.betList = this.bets
      console.log(this.betList)
      return
    }
    this.reloadData()
  },
  methods: {
    reloadData () {
      Loading.show()
      getBets().then((response) => {
        this.betList = response
        console.log(response)
        this.loadingBets = false
        // this.betList.forEach((bet) => {
        //   bet.author = {
        //     id: 1,
        //     pseudo: 'John Doe',
        //     avatarPath: '/src/assets/quasar-logo-vertical.svg'
        //   }
        //   bet.category = {
        //     id: 1,
        //     title: 'Sport',
        //     iconUrl: '/src/assets/quasar-logo-vertical.svg'
        //   }
        // })
        Loading.hide()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bet-list {
  width: 90%;
  margin: auto;
}
.q-list--separator > .q-item-type {
  border-color: white;
}
</style>
