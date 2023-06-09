<template>
  <div class="page-container bg-2 bg-2--image">
    <q-page class="flex flex-center column public-bets page">
      <div class="public-bets__top-container flex column">
        <q-icon class="public-bets__top-icon" name="fa fa-earth-americas" size="55px" color="white"></q-icon>
        <p class="public-bets__top-text q-mt-sm q-mb-0">Paris public</p>
      </div>
      <div class="page-content">
        <div class="public-bets__search-container flex justify-center q-mb-lg">
          <q-form class="public-bets__search-form form" ref="searchBetByIdForm">
            <q-input name="betIdToSearch" rounded outlined label="Code unique du pari" class="public-bets__search-input"
              type="search" v-model="betIdToSearch" bg-color="white" hide-bottom-space>
              <template v-slot:append>
                <div class="public-bets__search-btn-container">
                  <q-btn rounded color="secondary" text-color="white" class="btn btn-secondary public-bets__search-btn"
                    icon="search" type="submit"
                    @click.prevent="handleSearchSubmit()"></q-btn>
                </div>
              </template>
            </q-input>
          </q-form>
        </div>
        <div class="public-bets__categories-container q-my-md">
          <q-btn v-for="category in betCategories" :key="category.id" rounded
            :color="`${categoryId === category.id ? 'secondary' : 'primary'}`" text-color="white"
            :class="`btn btn-${categoryId === category.id ? 'secondary' : 'primary'} public-bets__categories-btn`"
            @click="categoryId === category.id ? categoryId = null : categoryId = category.id">
            <img :src="category.iconUrl" class="public-bets__categories-btn-icon" />
          </q-btn>
        </div>
        <BetList class="bet-list-component" :categoryId="categoryId" />
        <q-btn class="public-bets__add-bet-btn q-mt-md q-ml-lg fixed" label="Créer un pari" color="secondary" icon="add"
          round size="25px" padding="0" @click.prevent="() => $router.push({ name: 'add-bets' })" />
      </div>
    </q-page>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import BetList from 'src/components/BetList.vue'
import { getBetCategories } from 'src/services/categoryService'
import translate from 'src/stores/translatting'

export default {
  name: 'PublicBetsPage',
  components: {
    BetList
  },
  data() {
    return {
      betIdToSearch: '',
      betCategories: [],
      betCategoriesLoading: true,
      categoryId: null
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    handleSearchSubmit () {
      if (this.betIdToSearch.trim().length > 0) this.$router.push({ name: 'single-bet', params: { id: this.betIdToSearch } })
    },
    async reloadData() {
      this.betCategories = await getBetCategories().catch((error) => {
        Notify.create({
          message: translate().translateGetBetCategoriesError(error),
          color: 'negative',
          icon: 'report_problem',
          position: 'top',
          timeout: 3000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
      })
      this.betCategoriesLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.public-bets {
  &__search {
    &-container {
      gap: 10px;
    }

    &-btn {
      height: 100%;

      &-container {
        height: 100%;
        margin-right: -13px;
        z-index: 5;
      }
    }
  }

  &__categories {
    &-container {
      display: flex;
      flex-wrap: nowrap;
      gap: 5px;
      overflow-x: auto;
      height: 38px;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &-btn {
      width: 36px;
      height: 36px;

      &-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  &__top {
    &-container {
      width: 100%;
      height: 140px;
      background: url('/src/assets/public-bets-top.png') no-repeat top center/contain;
      text-align: center;
    }

    &-icon {
      margin: 20px auto 0 auto;
    }

    &-text {
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      line-height: 1em;
    }
  }

  &__add-bet {
    &-btn {
      bottom: 10px;
      right: -50px;
      background-color: $secondary;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      color: #fff;

      &::before {
        box-shadow: none !important;
      }
    }
  }
}

.page {
  justify-content: start;
}
</style>
<style lang="scss">
.public-bets {
  &__add-bet {
    &-btn {
      .q-btn__content {
        flex-direction: column;
        justify-content: start;
        margin: 15px 0 0 -45px;

        i {
          margin: 0;
        }

        span {
          font-size: 12px;
          text-transform: initial;
          font-weight: 300;
          line-height: 1;
          // margin-left: -10px;
        }
      }
    }
  }
}
</style>
