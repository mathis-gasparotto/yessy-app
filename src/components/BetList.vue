<template>
  <div class="q-mt-xl flex flex-center" v-if="loadingBets">
    <LoadingSpinner />
  </div>
  <q-list separator class="bet-list" v-else-if="betList.length > 0">
    <BetItem
      v-for="bet in betList"
      :key="bet.id"
      :item="bet"
    />
  </q-list>
  <p class="text-center q-mt-xl" v-else>Aucun paris n'est diponible pour le moment</p>
</template>

<script>
import { Notify } from 'quasar'
import BetItem from './BetItem.vue'
import { getBets, logout } from 'src/boot/firebase'
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  name: 'BetList',
  components: {
    BetItem,
    LoadingSpinner
  },
  props: {
    bets: {
      type: Array,
      required: false
    },
  },
  data() {
    return {
      betList: [],
      loadingBets: true
    }
  },
  created () {
    if (this.bets) {
      this.betList = this.bets
      this.loadingBets = false
      return
    }
    this.reloadData()
  },
  methods: {
    reloadData () {
      this.loadingBets = true
      getBets('future').then((response) => {
        this.betList = response
        setTimeout(() => {
          this.loadingBets = false
        }, 1000)
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
      }).catch((e) => {
        console.error(e)
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
