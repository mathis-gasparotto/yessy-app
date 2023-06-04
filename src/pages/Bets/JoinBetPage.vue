<template>
  <div class="page-container join-bet" :style="`--bg-img: url('${bet.category.imgUrl}')`" v-if="bet">
    <div class="sub-bg-dark absolute-full"></div>
    <q-page class="page scroll">
      <q-btn
        class="absolute join-bet__close-btn btn-secondary"
        icon="close"
        rounded
        @click="$router.push({ name: 'single-bet', params: { id: bet.id } })"
        size="12px"
      ></q-btn>
      <div class="page-content flex items-center justify-between column">
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
              v-if="!bet.customCost && !bet.customReward"
              name="tokenAmount"
              rounded
              outlined
              label="Smiles à mettre en jeu"
              class="q-mb-lg global-input bg-input-white"
              mask="#"
              type="number"
              reverse-fill-mask
              inputmode="numeric"
              v-model="tokenAmountToPlay"
              lazy-rules
              :rules="[
                (val) => val > 0 || 'Veullez renseigner un montant de smiles valide',
                (val) => val % 1 === 0 || 'Veullez renseigner un montant de smiles entier'
              ]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="fa-regular fa-face-smile" color="secondary" size="xs"></q-icon>
              </template>
            </q-input>

            <q-btn
              label="Valider la participation"
              type="submit"
              :class="`q-mb-lg text-bold form-btn btn btn-${validate ? 'secondary' : 'disabled'}`"
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
  <!-- <div class="nav-bar-bg"></div> -->
</template>

<script>
import { Loading, Notify } from 'quasar'
import { useRoute } from 'vue-router'
import translate from '../../stores/translatting'
import { getMyParticipation, participate, updateParticipation } from 'src/services/participationService'
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
      joinBetLoading: false,
      participationId: null
    }
  },
  created() {
    this.reloadData()
  },
  computed: {
    validate() {
      return this.idChoiceChosen && ((this.tokenAmountToPlay > 0 && this.tokenAmountToPlay % 1 === 0) || (this.bet.customCost && this.bet.customReward))
    }
  },
  methods: {
    joinBet() {
      if (!this.validate) return
      this.joinBetLoading = true
      if (this.participationId) {
        return updateParticipation(this.participationId, this.route.params.id, 'simple_bets', this.idChoiceChosen, this.tokenAmountToPlay)
          .then(() => {
            this.joinBetLoading = false
            Notify.create({
              message: 'Votre participation au pari a bien été modifiée',
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
            return this.$router.push({ name: 'single-bet', params: { id: this.route.params.id } })
          })
          .catch((err) => {
            this.joinBetLoading = false
            Notify.create({
              message: translate().translateUpdateParticipationError(err),
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
      }
      participate(this.route.params.id, this.idChoiceChosen, this.tokenAmountToPlay)
        .then(() => {
          this.joinBetLoading = false
          Notify.create({
            message: 'Vous avez rejoint le pari',
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
          this.joinBetLoading = false
          Notify.create({
            message: translate().translateAddParticipationError(err),
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
    async reloadData() {
      Loading.show()
      this.bet = await getBetWithoutAuthor(this.route.params.id).catch((err) => {
        Loading.hide()
        Notify.create({
          message: 'Une erreur est survenue lors du chargement du pari',
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
        return this.$router.push({ name: 'single-bet', params: { id: this.route.params.id } })
      })

      this.bet.choices = await getBetChoices(this.route.params.id).catch((err) => {
        Loading.hide()
        Notify.create({
          message: 'Une erreur est survenue lors du chargement des choix du pari',
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
        return this.$router.push({ name: 'single-bet', params: { id: this.route.params.id } })
      })

      const participation = await getMyParticipation(this.route.params.id, 'simple_bets').catch((err) => {
        Loading.hide()
        Notify.create({
          message: translate().translateGetParticipationError(err),
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
        return this.$router.push({ name: 'single-bet', params: { id: this.route.params.id } })
      })
      this.participationId = participation ? participation.id : null
      this.idChoiceChosen = participation ? participation.choice.id : null
      this.tokenAmountToPlay = participation ? (participation.tokenAmount ? participation.tokenAmount : null) : null
      Loading.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  background: var(--bg-img) no-repeat center center/cover fixed !important;
  .sub-bg-dark {
    background-color: rgba($color: #000, $alpha: 0.6);
    overflow: hidden;
  }
}
.join-bet {
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
