<template>
  <div class="page-container define-winner-choice" :style="`--bg-img: url('${bet.category.imgUrl}')`" v-if="bet">
    <div class="sub-bg-dark absolute-full"></div>
    <q-page class="page scroll">
      <q-btn
        class="absolute define-winner-choice__close-btn btn-secondary"
        icon="close"
        rounded
        @click="$router.push({ name: 'single-bet', params: { id: bet.id } })"
        size="12px"
      ></q-btn>
      <div class="page-content flex items-center justify-between column">
        <q-card class="define-winner-choice__title-container bg-primary--dark">
          <q-card-section class="define-winner-choice__category-section bg-primary">
            <div class="text-white text-bold text-center define-winner-choice__category">{{ bet.category.label }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-primary--dark define-winner-choice__title-section">
            <div class="text-white text-bold text-center define-winner-choice__title">{{ bet.label }}</div>
          </q-card-section>
        </q-card>
        <div class="define-winner-choice__choices-container flex flex-center column">
          <q-btn
            v-for="choice in bet.choices"
            :key="choice.id"
            :label="format.capitalize(choice.label)"
            :class="`define-winner-choice__choice-btn btn bg-${idChoiceChosen === choice.id ? 'primary' : 'white'} ${
              idChoiceChosen === choice.id ? 'chosen text-bold text-white' : ''
            }`"
            rounded
            @click.prevent="idChoiceChosen = choice.id"
            :loading="loading"
            padding="sm"
            size="20px"
          />
        </div>
        <div class="define-winner-choice__submit-container">
          <q-btn
            label="Définir le choix gagnant"
            type="submit"
            :class="`q-mb-lg text-bold form-btn btn btn-${this.idChoiceChosen !== null ? 'secondary' : 'disabled'}`"
            :disable="this.idChoiceChosen === null"
            rounded
            @click.prevent="onSubmit()"
            :loading="submitLoading"
            padding="sm 50px"
            size="20px"
          />
        </div>
      </div>
    </q-page>
  </div>
  <!-- <div class="nav-bar-bg"></div> -->
</template>

<script>
import { Loading, Notify } from 'quasar'
import { useRoute } from 'vue-router'
import translate from '../../services/translatting'
import { getBetWithoutAuthor, setWinnerChoice } from 'src/services/betService'
import { getBetChoices } from 'src/services/choiceService'
import format from '../../services/formatting'

export default {
  setup() {
    const route = useRoute()

    return {
      route
    }
  },
  name: 'DefineWinnerChoicePage',
  data() {
    return {
      bet: null,
      joinLoading: false,
      idChoiceChosen: null,
      format: format(),
      tokenAmountToPlay: null,
      submitLoading: false
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    onSubmit() {
      this.submitLoading = true
      setWinnerChoice(this.route.params.id, this.idChoiceChosen)
        .then(() => {
          this.submitLoading = false
          Notify.create({
            message: 'Vous avez défini le choix gagant de ce pari',
            color: 'positive',
            icon: 'check_circle',
            position: 'top',
            timeout: 3000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          this.$router.push({ name: 'single-bet', params: { id: this.route.params.id } })
        })
        .catch((err) => {
          this.submitLoading = false
          Notify.create({
            message: translate().translateSetWinnerChoiceError(err),
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
    },
    reloadData() {
      Loading.show()
      getBetWithoutAuthor(this.route.params.id)
        .then((res) => {
          this.bet = res
          getBetChoices(this.route.params.id).then((res) => {
            this.bet.choices = res
          })
          Loading.hide()
        })
        .catch(() => {
          Loading.hide()
          this.$router.push({ name: 'single-bet', params: { id: this.route.params.id } })
        })
    }
  }
}
</script>

<style lang="scss" scoped>

.page-container {
  background: var(--bg-img) no-repeat center center/cover fixed !important;
  padding-bottom: 30px;
  margin-bottom: -30px;
  .sub-bg-dark {
    background-color: rgba($color: #000, $alpha: 0.6);
    overflow: hidden;
  }
}
.define-winner-choice {
  &__close-btn {
    top: 20px;
    right: 20px;
    z-index: 100;
    width: 31px;
    height: 31px;
  }
  .page {
    &-content {
      gap: 50px;
      flex-wrap: nowrap;
      min-height: calc(100vh - 72px);
    }
  }
  &__title {
    &-container {
      width: 100%;
      margin-top: 50px;
      border-radius: 10px;
    }
  }
  &__category {
    &-section {
      border-radius: 10px !important;
    }
  }
  &__choice {
    &-btn {
      width: 100%;
      border: 1px solid transparent;
      &.chosen {
        transition: 0.2s ease-in-out;
        border-color: #fff;
      }
    }
    &s {
      &-container {
        width: 90%;
        gap: 30px;
        flex-wrap: nowrap;
      }
    }
  }
}
// .nav-bar-bg {
//   background-color: color-mix(in srgb, $primary 70%, #000 30%) !important;
// }
</style>
