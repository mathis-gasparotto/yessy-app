<template>
  <q-item clickable :to="`/bets/${id}`">
    <q-item-section>
      <q-img :src="iconPath" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'BetItem',
  props: {
    title: String,
    description: String,
    iconPath: String,
    id: Number
  }
}
</script>
