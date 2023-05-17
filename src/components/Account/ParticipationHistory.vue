<template>
  <div class="history">
    <div class="history__title">
      <h2 class="text-h6">Historique des paris</h2>
    </div>
    <div class="history__list" v-if="bets">
      <BetList :bets="bets" :loadingBetsProp="loadingBets" />
    </div>
  </div>
</template>

<script>
import { Loading, Notify } from 'quasar'
import { getMyParticipations } from 'src/boot/firebase'
import BetList from '../BetList.vue'

export default {
  name: 'ParticipationHistory',
  components: {
    BetList
  },
  data() {
    return {
      bets: null,
      loadingBets: true
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    reloadData() {
      Loading.show()
      this.loadingBets = true
      getMyParticipations()
        .then((bets) => {
          // LocalStorage.set('user', user)
          this.bets = bets
          console.log(this.bets)
          Loading.hide()
          this.loadingBets = false
        })
        .catch(() => {
          Notify.create({
            message: 'Une erreur est survenue',
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          Loading.hide()
          this.$router.push({ name: 'home' })
          throw new Error('Une erreur est survenue')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.history {
  &__title {
    position: relative;
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
