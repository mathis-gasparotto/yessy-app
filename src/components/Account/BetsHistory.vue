<template>
  <div class="q-pb-xl">
    <div class="flex items-center justify-between q-mb-md bets-history-main__btns-container">
      <q-btn
        square
        @click="component = 'ParticipationHistory'"
        :class="`btn btn-secondary bets-history-main__btn ${component === 'ParticipationHistory' ? 'active' : ''}`"
        color="secondary"
        >Participations</q-btn
      >
      <q-btn
        square
        @click="component = 'MyBets'"
        :class="`btn btn-secondary bets-history-main__btn ${component === 'MyBets' ? 'active' : ''}`"
        color="secondary"
        >Mes paris</q-btn
      >
    </div>
    <component :is="component" />
  </div>
</template>

<script>
import ParticipationHistory from './ParticipationHistory.vue'
import MyBets from './MyBets.vue'

export default {
  name: 'BetsHistory',
  components: {
    ParticipationHistory,
    MyBets
  },
  data() {
    return {
      component: 'ParticipationHistory'
    }
  }
}
</script>

<style lang="scss" scoped>
.bets-history-main {
  &__btn {
    width: 45%;
    border-radius: 5px;
    transition: 0.2s ease-in-out;
    &.active {
      font-size: 1.1rem;
    }
    &s {
      &-container {
        width: 100%;
        height: 50px;
      }
    }
  }
}
</style>
