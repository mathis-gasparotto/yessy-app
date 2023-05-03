<template>
  <div class="page-container">
    <q-page class="flex flex-center page column add-bet bg-2 scroll">
      <div class="page-content">
        <div class="add-bet__header flex flex-center column q-py-md">
          <q-icon name="fa fa-trophy" color="white" size="30px"></q-icon>
          <h1 class="add-bet__header-title text-h6">{{ headerTitle }}</h1>
          <div class="add-bet__header-dots flex flex-center">
            <q-icon name="circle" size="17px" color="secondary"></q-icon>
            <q-icon name="circle" size="17px" :color="component === 'AddBetPrivacy' ? 'white' : 'secondary'"></q-icon>
            <q-icon name="circle" size="17px" :color="component === 'AddBetForm' ? 'secondary' : 'white'"></q-icon>
          </div>
        </div>
      </div>
      <div class="add-bet__component">
        <component :is="component"
          @choosePrivacy="(privacy) => choosePrivacy(privacy)"
          @chooseCategory="(categoryId) => chooseCategory(categoryId)"
        />
      </div>
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
      privacy: null,
      categoryId: null
    }
  },
  computed: {
    headerTitle () {
      switch (this.component) {
        case 'AddBetPrivacy':
          return 'Choix du salon'
        case 'AddBetCategory':
          return 'Type de pari'
        case 'AddBetForm':
          return 'Paramètres du pari'
        default:
          return 'Choix du salon'
      }
    }
  },
  methods: {
    choosePrivacy(privacy) {
      this.privacy = privacy
      console.log(this.privacy)
      this.component = 'AddBetCategory'
    },
    chooseCategory(categoryId) {
      this.categoryId = categoryId
      console.log(this.categoryId)
      this.component = 'AddBetForm'
    }
  }
}
</script>

<style lang="scss" scoped>
.add-bet {
  &__header {
    background-color: $primary;
    color: white;
    border-radius: 10px;
    &-title {
      margin: 0;
    }
    &-dots {
      gap: 10px;
    }
  }
  &__component {
    width: 100%;
    height: 65vh;
  }
}
</style>
