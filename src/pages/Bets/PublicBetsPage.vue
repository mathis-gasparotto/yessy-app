<template>
  <div class="page-container">
    <q-page class="flex flex-center column public-bets page">
      <div class="page-content">
        <BetList class="bet-list-component" />
        <div class="public-bets__add-bet-container fixed" @click="() => $router.push({ name: 'add-bets' })">
          <q-btn
            class="public-bets__add-bet-btn q-mt-md q-ml-md"
            color="secondary"
            icon="add"
            round
            size="25px"
            padding="0"
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
  &__add-bet {
    &-container {
      bottom: 10px;
      right: -50px;
      background-color: $secondary;
      width: 130px;
      height: 130px;
      border-radius: 50%;
    }
    &-btn {
      color: #fff;
      background-color: none !important;
      &::before {
        box-shadow: none !important;
      }
    }
  }
}
.page {
  justify-content: start;
}
</style>
