<template>
  <div class="history q-pb-xl">
    <div class="history__title q-mb-md">
      <h2 class="text-h6">Historique de mes participations</h2>
    </div>
    <LoadingSpinner v-if="loadingBets" />
    <div class="history__list" v-else>
      <BetList :bets="bets" v-if="bets && bets.length > 0"/>
      <p class="text-center q-mt-lg" v-else-if="bets.length === 0">Vous n'avez pas encore participé à un pari</p>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import BetList from '../BetList.vue'
import LoadingSpinner from '../LoadingSpinner.vue'
import { getMyParticipations } from 'src/services/participationService'

export default {
  name: 'ParticipationHistory',
  components: {
    BetList,
    LoadingSpinner
  },
  data() {
    return {
      bets: [],
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
          this.bets = bets
          this.loadingBets = false
        })
        .catch((e) => {
          if (e.message !== 'No such data!') {
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
          }
          this.loadingBets = false
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
