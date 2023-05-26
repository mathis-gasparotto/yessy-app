<template>
  <div class="page-container bg-2 bg-2--image">
    <div class="public-bets__top-container flex column">
      <q-icon class="public-bets__top-icon" name="public" size="55px" color="white"></q-icon>
      <p class="public-bets__top-text">Paris public</p>
    </div>
    <q-page class="flex flex-center column public-bets page">
      <div class="page-content">
        <BetList class="bet-list-component" />
        <div class="public-bets__add-bet-container fixed flex column" @click="() => $router.push({ name: 'add-bets' })">
          <q-btn class="public-bets__add-bet-btn q-mt-md q-ml-lg" color="secondary" icon="add" round size="25px"
            padding="0" />
          <p class="text-white text-small q-ml-sm">Créer un pari</p>
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
  &__top {
    &-container {
      width: 100%;
      height: 120px;
      background: url('/src/assets/public-bets-top.png') no-repeat top center/contain;
      text-align: center;
    }

    &-icon {
      margin: 15px auto 0 auto;
    }

    &-text {
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      margin: 0;
      line-height: 1em;
    }
  }

  &__add-bet {
    &-container {
      bottom: 10px;
      right: -50px;
      background-color: $secondary;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      align-items: start;
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
