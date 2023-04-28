<template>
  <q-item clickable :to="`/bets/${item.id}`" class="bet-card-container">
    <div class="bet-card-section bet-card-section--img">
      <img :src="item.category.iconPath" class="bet-card-cat-icon" />
    </div>

    <div class="bet-card-section bet-card-section--text flex justify-center column">
      <q-item-label class="bet-card-pre-title">Pari en cours :</q-item-label>
      <q-item-label class="bet-card-title">{{ item.title }}</q-item-label>
    </div>

    <div class="bet-card-section bet-card-section--next flex flex-center">
      <q-btn flat round color="white" icon="navigate_next" class="bet-card-next-icon"/>
    </div>
  </q-item>
</template>

<script>
export default {
  name: 'BetItem',
  props: {
    item: Object
  }
}
</script>

<style lang="scss" scoped>
$spacing: 12px;
$height: 100px;
.bet {
  &-card {
    &-container {
      height: $height;
      padding: $spacing 0;
      gap: 15px;
      margin-left: -15px;
    }
    &-section {
      &--img {
        width: 25%;
      }
      &--text {
        width: 70%;
      }
      &--next {
        width: 25%;
      }
    }
    &-cat-icon {
      width: calc(#{$height} - 2 * #{$spacing});
      height: calc(#{$height} - 2 * #{$spacing});
      background-color: $primary;
      padding: 12px;
      border-radius: 500000px;
      color: white;
    }
    &-next-icon {
      width: 40px;
      height: 40px;
      background-color: $secondary;
      padding: 10px;
      border-radius: 500000px;
    }
    &-pre-title {
      font-weight: 800;
      color: $secondary;
      font-size: 1.1rem;
    }
  }
}
</style>
