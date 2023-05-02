<template>
  <div class="page-container">
    <q-page class="flex flex-center public-bets">
      <BetList class="bet-list-component" />
      <div class="public-bets__add-bet-container">
        <q-btn
          class="public-bets__add-bet"
          color="primary"
          icon="add"
          round
          @click="() => $router.push({ name: 'add-bets' })"
        />
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
