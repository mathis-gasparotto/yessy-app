<template>
  <q-item clickable :to="`/bets/${item.id}`" class="bet-card-container">
    <div class="bet-card-section bet-card-section--img">
      <img :src="item.category.iconUrl" class="bet-card-cat-icon" />
    </div>

    <div class="bet-card-section bet-card-section--text flex justify-center column">
      <q-item-label class="bet-card-pre-title">{{ cardLabel }}</q-item-label>
      <q-item-label class="bet-card-title">{{ item.label }}</q-item-label>
    </div>

    <div class="bet-card-section bet-card-section--next flex flex-center">
      <q-btn flat round color="white" icon="navigate_next" class="bet-card-next-icon" />
    </div>
  </q-item>
</template>

<script>
export default {
  name: 'BetItem',
  props: {
    item: Object
  },
  computed: {
    cardLabel() {
      const now = new Date()
      const end = new Date(this.item.endAt.seconds * 1000)
      const start = new Date(this.item.startAt.seconds * 1000)
      if (now < start) {
        return 'Paris à venir :'
      } else if (now < end) {
        return 'Paris en cours :'
      } else {
        return 'Paris terminés :'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$spacing: 10px;
$icon-spacing: 16px;
$height: 76px;

.bet {
  &-card {
    &-container {
      height: calc(#{$height} + 2 * #{$spacing});
      padding: $spacing 0;
      gap: 15px;
      margin-left: -15px;
    }

    &-section {
      &--img {
        border-radius: 500000px;
        background-color: $primary;
        padding: $icon-spacing;
      }

      &--text {
        width: 70%;
      }

      &--next {
        width: 25%;
      }
    }

    &-cat-icon {
      width: calc(#{$height} - 2 * #{$icon-spacing});
      height: calc(#{$height} - 2 * #{$icon-spacing});
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
      font-weight: 700;
      color: $secondary;
      font-size: 1.1rem;
    }
  }
}</style>
