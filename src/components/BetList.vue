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
import { getBets } from 'src/services/betService'
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
    categoryId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      betList: [],
      loadingBets: true
    }
  },
  watch: {
    categoryId () {
      this.reloadData()
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
      getBets('active', this.categoryId).then((response) => {
        // Timeout is required to avoid a bug with loading categories icons
        setTimeout(() => {
          this.betList = response
          console.log(this.betList)
          this.loadingBets = false
        }, 700)
      }).catch((e) => {
        console.error(e)
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
  // border-color: #fff;
  border-top: 2px solid #fff;
  &:first-child {
    border-top: none;
  }
}
</style>
