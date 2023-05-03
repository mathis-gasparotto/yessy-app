<template>
  <div class="page-container">
    <q-page class="flex flex-center column public-bets">
      <div class="page-content">
        <BetList class="bet-list-component" />
        <div class="public-bets__add-bet-container fixed">
          <q-btn
            class="public-bets__add-bet"
            color="primary"
            icon="add"
            round
            @click="() => $router.push({ name: 'add-bets' })"
          />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import BetList from 'src/components/BetList.vue'

export default {
  name: 'PublicBetsPage',
  components: {
    BetList
  }
}
</script>

<style lang="scss" scoped>
.public-bets {
  .public-bets__add-bet-container {
    bottom: 100px;
    right: 20px;
  }
}
</style>
