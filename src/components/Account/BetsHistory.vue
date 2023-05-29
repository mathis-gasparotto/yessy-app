<template>
  <div class="q-pb-xl">
    <div class="flex items-center justify-between q-mb-md bets-history-main__btns-container">
      <q-btn
        square
        @click="component = 'ParticipationHistory'"
        :class="`btn btn-secondary btn-bordered--thin bets-history-main__btn`"
        :color="`${component === 'ParticipationHistory' ? 'secondary' : 'white'}`"
        :text-color="`${component === 'ParticipationHistory' ? 'white' : 'secondary'}`"
        size="1.1rem"
        >Participations</q-btn
      >
      <q-btn
        square
        @click="component = 'MyBets'"
        :class="`btn btn-secondary btn-bordered--thin bets-history-main__btn`"
        :color="`${component === 'MyBets' ? 'secondary' : 'white'}`"
        :text-color="`${component === 'MyBets' ? 'white' : 'secondary'}`"
        size="1.1rem"
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
    &s {
      &-container {
        width: 100%;
      }
    }
  }
}
</style>
