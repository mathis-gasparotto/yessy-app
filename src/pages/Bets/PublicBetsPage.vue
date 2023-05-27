<template>
  <div class="page-container bg-2 bg-2--image">
    <q-page class="flex flex-center column public-bets page">
      <div class="public-bets__top-container flex column">
        <q-icon class="public-bets__top-icon" name="fa fa-earth-americas" size="55px" color="white"></q-icon>
        <p class="public-bets__top-text">Paris public</p>
      </div>
      <div class="page-content">
        <BetList class="bet-list-component" />
        <q-btn
          class="public-bets__add-bet-btn q-mt-md q-ml-lg fixed"
          label="Créer un pari"
          color="secondary"
          icon="add"
          round
          size="25px"
          padding="0"
          @click.prevent="() => $router.push({ name: 'add-bets' })"
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

    &-btn {
      bottom: 10px;
      right: -50px;
      background-color: $secondary;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      color: #fff;

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
<style lang="scss">
.public-bets {
  &__add-bet {
    &-btn {
      .q-btn__content {
        flex-direction: column;
        justify-content: start;
        margin: 15px 0 0 -45px;
        i {
          margin: 0;
        }
        span {
          font-size: 12px;
          text-transform: initial;
          font-weight: 300;
          line-height: 1;
          // margin-left: -10px;
        }
      }
    }
  }
}
</style>
