<template>
  <div class="add-bet-category__cards page-content">
    <q-card
      flat
      v-for="category in betCatgories"
      :key="category.id"
      class="add-bet-category__card"
      @click.prevent="$emit('chooseCategory', category.id)"
    >
      <q-card-section class="add-bet-category__card-section">
        <h2 class="add-bet-category__card-text text-h6 text-center">{{ category.label }}</h2>
        <img
          :src="category.iconUrl"
          :alt="`image-de-${createFormat().kebabCaseFormatting(category.label)}`"
          class="add-bet-category__card-icon"
        />
        <div class="add-bet-category__card-bg"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { getBetCategories } from 'src/services/categoryService'
import createFormat from '../../stores/formatting.js'
import { Loading, Notify } from 'quasar'

export default {
  name: 'AddBetCategory',
  data() {
    return {
      createFormat: createFormat,
      betCatgories: []
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    reloadData() {
      Loading.show()
      getBetCategories()
        .then((response) => {
          this.betCatgories = response
          Loading.hide()
        })
        .catch(() => {
          Notify.create({
            message: 'Une erreur est survenue lors du chargement des catégories de paris',
            color: 'negative',
            icon: 'report_problem',
            timeout: 3000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          this.$router.push({ name: 'home' })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-bet {
  &-category {
    &__card {
      border-radius: 30px;
      &-bg {
        width: 40%;
        height: 40%;
        z-index: -1;
        position: absolute;
        background-image: url('/src/assets/logo-yessy.png');
        background-repeat: no-repeat;
        background-size: contain;
        opacity: 0.25;
      }
      &-section {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }
      &s {
        display: grid;
        grid-template: repeat(2, 1fr) / repeat(2, 1fr);
        grid-gap: 15px;
      }
      &:nth-of-type(4n),
      &:nth-of-type(4n + 1) {
        background-color: $secondary;
      }
      &:nth-of-type(4n + 2),
      &:nth-of-type(4n + 3) {
        background-color: $primary;
      }
      // little cards
      &:nth-of-type(3n-1),
      &:nth-of-type(3n) {
        height: 150px;
        .add-bet-category__card-section {
          gap: 20px;
        }
      }
      // big cards
      &:nth-of-type(3n-2) {
        height: 180px;
        .add-bet-category__card-section {
          gap: 30px;
        }
      }
      &:nth-of-type(6n-2) {
        margin-top: -30px;
      }
      &:nth-of-type(5),
      &:nth-of-type(6) {
        margin-top: -30px;
      }
      &:nth-of-type(2n) {
        .add-bet-category__card-section {
          flex-direction: column-reverse;
          justify-content: end;
        }
      }
      &:nth-of-type(4n) {
        .add-bet-category__card-bg {
          bottom: 10px;
          left: 20px;
        }
      }
      &:nth-of-type(4n + 1) {
        .add-bet-category__card-bg {
          bottom: 10px;
          right: 20px;
        }
      }
      &:nth-of-type(4n + 2) {
        .add-bet-category__card-bg {
          top: 15px;
          left: 20px;
        }
      }
      &:nth-of-type(4n + 3) {
        .add-bet-category__card-bg {
          top: 15px;
          right: 20px;
        }
      }
      &-text {
        margin: 0;
        color: white;
        margin: 0;
      }
      &-icon {
        width: 60px;
        height: 60px;
        stroke: white;
        fill: white;
      }
    }
  }
}
.page-content {
  padding-top: 0px;
}
</style>
