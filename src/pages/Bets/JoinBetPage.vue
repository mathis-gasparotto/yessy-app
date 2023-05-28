<template>
  <div class="page-container bg-primary bg-primary--image join-bet">
    <q-page class="page scroll">
      <div class="page-content flex items-center justify-between column" v-if="bet">
        <q-card class="join-bet__title-container bg-primary--dark">
          <q-card-section class="join-bet__category-section bg-primary">
            <div class="text-white text-bold text-center join-bet__category">{{ bet.category.label }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-primary--dark join-bet__title-section">
            <div class="text-white text-bold text-center join-bet__title">{{ bet.label }}</div>
          </q-card-section>
        </q-card>
        <div class="join-bet__choices-container flex flex-center column">
          <q-btn
            v-for="choice in bet.choices"
            :key="choice.id"
            :label="format.capitalize(choice.label)"
            :class="`join-bet__choice-btn btn bg-${idChoiceChosen === choice.id ? 'primary' : 'white'} ${
              idChoiceChosen === choice.id ? 'chosen text-bold text-white' : ''
            }`"
            rounded
            @click.prevent="idChoiceChosen = choice.id"
            :loading="loading"
            padding="sm"
            size="20px"
          />
        </div>
        <div class="join-bet__submit-container">
          <q-form class="join-bet__form flex flex-center column form" ref="joinBetForm">
            <q-input
              v-if="!bet.customCost"
              name="tokenAmount"
              rounded
              outlined
              label="Smiles à mettre en jeu"
              class="q-mb-lg global-input"
              mask="#"
              reverse-fill-mask
              v-model="tokenAmountToPlay"
              lazy-rules
              :rules="[(val) => val > 0 || 'Veullez renseigner un montant de smiles valide']"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="fa-regular fa-face-smile" color="secondary" size="xs"></q-icon>
              </template>
            </q-input>

            <q-btn
              label="Valider le choix"
              type="submit"
              :class="`text-bold form-btn btn btn-${validate ? 'secondary' : 'disabled'}`"
              :disable="!validate"
              rounded
              @click.prevent="joinBet()"
              :loading="joinBetLoading"
              padding="sm 50px"
              size="20px"
            />
          </q-form>
        </div>
      </div>
    </q-page>
  </div>
  <div class="nav-bar-bg"></div>
</template>

<script>
import { Loading, Notify } from 'quasar'
import { useRoute } from 'vue-router'
import translate from '../../stores/translatting'
import { participate } from 'src/services/participationService'
import { getBetWithoutAuthor } from 'src/services/betService'
import { getBetChoices } from 'src/services/choiceService'
import format from '../../stores/formatting'

export default {
  setup() {
    const route = useRoute()

    return {
      route
    }
  },
  name: 'JoinBetPage',
  data() {
    return {
      bet: null,
      joinLoading: false,
      idChoiceChosen: null,
      format: format(),
      tokenAmountToPlay: null,
      joinBetLoading: false
    }
  },
  created() {
    this.reloadData()
  },
  computed: {
    validate() {
      return this.idChoiceChosen && (this.tokenAmountToPlay > 0 || this.bet.customCost)
    }
  },
  methods: {
    joinBet() {
      this.joinBetLoading = true
      participate(this.route.params.id, this.idChoiceChosen, this.tokenAmountToPlay)
        .then(() => {
          this.joinBetLoading = false
          Notify.create({
            message: 'Vous avez rejoint le pari',
            color: 'positive',
            icon: 'check_circle',
            timeout: 3000,
            position: 'top',
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
          this.joinBetLoading = false
          Notify.create({
            message: translate().translateAddParticipationError(err),
            color: 'negative',
            icon: 'report_problem',
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
.join-bet {
  .page {
    background-color: rgba($color: #000, $alpha: 0.3);
    &-content {
      gap: 50px;
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
      &.chosen {
        transition: 0.2s ease-in-out;
        border: 1px solid #fff;
      }
    }
    &s {
      &-container {
        width: 90%;
        gap: 30px;
      }
    }
  }
}
.nav-bar-bg {
  background-color: color-mix(in srgb, $primary 70%, #000 30%) !important;
}
</style>
