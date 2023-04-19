<template>
  <q-list separator>
    <BetItem
      v-for="bet in bets"
      :key="bet.id"
      :id="bet.id"
      :title="bet.title"
      :description="bet.description"
      :iconPath="bet.iconPath"
      />
  </q-list>
</template>

<script>
import BetItem from './BetItem.vue'

export default {
  name: 'BetList',
  components: {
    BetItem
  },
  props: {
    bets: Array
  }
}
</script>
