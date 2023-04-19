<template>
  <q-page class="flex flex-center column">
    Home
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <BetList :bets="bets" />
  </q-page>
</template>

<script>
import BetList from 'src/components/BetList.vue'

export default {
  name: "HomePage",
  components: {
    BetList
  },
  data () {
    return {
      bets: [
        {
          id: 1,
          title: 'Bet 1',
          description: 'Description 1',
          iconPath: 'oui.png'
        },
        {
          id: 2,
          title: 'Bet 2',
          description: 'Description 2',
          iconPath: 'oui.png'
        },
        {
          id: 3,
          title: 'Bet 3',
          description: 'Description 3',
          iconPath: 'oui.png'
        },
        {
          id: 4,
          title: 'Bet 4',
          description: 'Description 4',
          iconPath: 'oui.png'
        },
        {
          id: 5,
          title: 'Bet 5',
          description: 'Description 5',
          iconPath: 'oui.png'
        }
      ]
    }
  }
}
</script>
