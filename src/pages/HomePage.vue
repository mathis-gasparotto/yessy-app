<template>
  <q-page class="flex flex-center column page bg-2">
    <div class="home-cat-title">
      <p class="text-h6">Chauffe toi sur ces paris</p>
      <span class="underliner"></span>
    </div>
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

<style lang="scss" scoped>
.home {
  &-cat-title {
    position: relative;
    p {
      z-index: 1;
    }
    .underliner {
      position: absolute;
      top: 20px;
      width: 100%;
      background-color: $secondary;
      height: 12px;
      display: inline-block;
    }
  }
}
</style>
