<template>
  <LoadingSpinner v-if="loadingBets" />
  <div class="history q-pb-xl" v-else>
    <div class="history__title">
      <h2 class="text-h6">Historique des paris</h2>
    </div>
    <div class="history__list" >
      <BetList :bets="bets" v-if="bets && bets.length > 0"/>
      <p class="text-center q-mt-lg" v-else-if="bets.length === 0">Vous n'avez pas encore participé à un pari</p>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import { getMyParticipations } from 'src/boot/firebase'
import BetList from '../BetList.vue'
import LoadingSpinner from '../LoadingSpinner.vue'

export default {
  name: 'ParticipationHistory',
  components: {
    BetList,
    LoadingSpinner
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
      this.loadingBets = true
      getMyParticipations()
        .then((bets) => {
          // LocalStorage.set('user', user)
          this.bets = bets
          this.loadingBets = false
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
          this.$router.push({ name: 'home' })
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
