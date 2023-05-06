<template>
  <div class="add-bet-category__cards page-content">
    <q-card flat v-for="category in betCatgories" :key="category.id" class="add-bet-category__card" @click.prevent="$emit('chooseCategory', category.id)">
      <q-card-section class="add-bet-category__card-section">
        <h2 class="add-bet-category__card-text text-h6 text-bold text-center">{{ category.label }}</h2>
        <img :src="category.iconUrl" :alt="`image-de-${createFormat().kebabCaseFormatting(category.label)}`" class="add-bet-category__card-icon" />
        <div class="add-bet-category__card-bg"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import createFormat from '../../stores/formatting.js'

export default {
  name: 'AddBetCategory',
  data() {
    return {
      createFormat: createFormat,
      betCatgories: [
        {
          id: 1,
          label: 'Actualités',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 2,
          label: 'Football',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 3,
          label: 'TV',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 4,
          label: 'Basketball',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 5,
          label: 'Jeux vidéos',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 6,
          label: 'Course',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 7,
          label: 'Musique',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 8,
          label: 'Tennis',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 9,
          label: 'Films',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 10,
          label: 'Autres',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 11,
          label: 'Actualités',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 12,
          label: 'Football',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 13,
          label: 'Basketball',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 14,
          label: 'TV',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 15,
          label: 'Jeux vidéos',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 16,
          label: 'Course',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 17,
          label: 'Musique',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 18,
          label: 'Tennis',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 19,
          label: 'Films',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 20,
          label: 'Autres',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 21,
          label: 'Actualités',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 22,
          label: 'Football',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 23,
          label: 'Basketball',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 24,
          label: 'TV',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 25,
          label: 'Jeux vidéos',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 26,
          label: 'Course',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 27,
          label: 'Musique',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 28,
          label: 'Tennis',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 29,
          label: 'Films',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 30,
          label: 'Autres',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 31,
          label: 'Actualités',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 32,
          label: 'Football',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 33,
          label: 'Basketball',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 34,
          label: 'TV',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 35,
          label: 'Jeux vidéos',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 36,
          label: 'Course',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 37,
          label: 'Musique',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 38,
          label: 'Tennis',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 39,
          label: 'Films',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
        {
          id: 40,
          label: 'Autres',
          iconUrl: '/src/assets/quasar-logo-vertical.svg'
        },
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.add-bet {
  &-category {
    &__card {
      border-radius: 30px;
      &-bg {
        width: 60%;
        height: 60%;
        z-index: -1;
        position: absolute;
        background-image: url('/src/assets/quasar-logo-vertical.svg');
        background-repeat: no-repeat;
        background-size: contain;
        opacity: .3;
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
      &:nth-of-type(4n), &:nth-of-type(4n+1) {
        background-color: $secondary;
      }
      &:nth-of-type(4n+2), &:nth-of-type(4n+3) {
        background-color: $primary;
      }
      // little cards
      &:nth-of-type(3n-1), &:nth-of-type(3n) {
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
      &:nth-of-type(5), &:nth-of-type(6) {
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
          top: 0;
          left: 0;
        }
      }
      &:nth-of-type(4n+1) {
        .add-bet-category__card-bg {
          bottom: 0;
          left: 0;
        }
      }
      &:nth-of-type(4n+2) {
        .add-bet-category__card-bg {
          top: 0;
          right: 0;
        }
      }
      &:nth-of-type(4n+3) {
        .add-bet-category__card-bg {
          bottom: 0;
          right: 0;
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
