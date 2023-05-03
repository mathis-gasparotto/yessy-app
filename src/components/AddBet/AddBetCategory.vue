<template>
  <q-card flat v-for="category in betCatgories">
    <q-card-section>

    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'AddBetCategory',
  data() {
    return {
      betCatgories: [
        {
          id: 1,
          label: 'Actualités',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 2,
          label: 'Football',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 3,
          label: 'Basketball',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 4,
          label: 'TV',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 5,
          label: 'Jeux vidéos',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 6,
          label: 'Course',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 7,
          label: 'Musique',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 8,
          label: 'Tennis',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 9,
          label: 'Films',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        },
        {
          id: 10,
          label: 'Autres',
          imgUrl: '~assets/quasar-logo-vertical.svg'
        }
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.add-bet {
  &-category {

  }
}
</style>
