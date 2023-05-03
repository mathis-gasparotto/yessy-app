<template>
  <div class="page-container">
    <q-page class="flex flex-center page column add-bet bg-2">
      <div class="page-content">
        <div class="add-bet__header flex flex-center column q-py-md">
          <q-icon name="fa fa-trophy" color="white" size="30px"></q-icon>
          <h1 class="add-bet__header-title text-h6">Choix du salon</h1>
          <div class="add-bet__header-dots flex flex-center">
            <q-icon name="circle" size="17px" color="secondary"></q-icon>
            <q-icon name="circle" size="17px" color="white"></q-icon>
            <q-icon name="circle" size="17px" color="white"></q-icon>
          </div>
        </div>
      </div>
      <component :is="component" @choosePrivacy="(privacy) => choosePrivacy(privacy)" />
    </q-page>
  </div>
</template>

<script>
import AddBetPrivacy from 'src/components/AddBet/AddBetPrivacy.vue'
import AddBetCategory from 'src/components/AddBet/AddBetCategory.vue'

export default {
  name: 'AddBetPage',
  components: {
    AddBetPrivacy,
    AddBetCategory
  },
  data() {
    return {
      component: 'AddBetPrivacy',
      privacy: null
    }
  },
  methods: {
    choosePrivacy(privacy) {
      this.privacy = privacy
      console.log(this.privacy)
      this.component = 'AddBetCategory'
    }
  }
}
</script>

<style lang="scss" scoped>
.add-bet {
  &__header {
    background-color: $primary;
    width: 90%;
    margin: auto;
    color: white;
    border-radius: 10px;
    &-title {
      margin: 0;
    }
    &-dots {
      gap: 10px;
    }
  }
}
</style>
