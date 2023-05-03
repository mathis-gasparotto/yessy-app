<template>
  <div class="page-container bg-2">
    <q-page class="flex flex-center column page">
      <div class="page-content">
        <div class="home-cat-title">
          <h2 class="text-h6">Chauffe toi sur ces paris</h2>
          <span class="underliner"></span>
        </div>
        <BetList class="bet-list-component" />
      </div>
    </q-page>
  </div>
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
    h2 {
      position: relative;
      z-index: 1;
      font-weight: bold;
      display: inline;
    }
    .underliner {
      position: absolute;
      top: 20px;
      left: -10px;
      width: 110%;
      background-color: $secondary;
      height: 12px;
      display: inline-block;
    }
  }
}
</style>
