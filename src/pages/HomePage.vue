<template>
  <q-page class="flex flex-center column">
    Home
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <BetList />
  </q-page>
</template>

<script>
import BetList from 'src/components/BetList.vue'

export default {
  name: 'HomePage',
  components: {
    BetList
  }
}
</script>
