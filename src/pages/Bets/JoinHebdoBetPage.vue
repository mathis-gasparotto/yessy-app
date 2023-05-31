<template>
  <div class="page-container join-hebdo-bet" :style="`--bg-img: url('${bet.category.imgUrl}')`" v-if="bet">
    <div class="sub-bg-dark absolute-full"></div>
    <q-page class="page scroll">
      <q-btn
        class="absolute join-hebdo-bet__close-btn btn-secondary"
        icon="close"
        rounded
        @click="$router.push({ name: 'home' })"
        size="12px"
      ></q-btn>
      <div class="page-content flex items-center justify-between column">
        <q-card class="join-hebdo-bet__title-container bg-primary--dark">
          <q-card-section class="join-hebdo-bet__category-section bg-primary">
            <div class="text-white text-bold text-center join-hebdo-bet__category">Pronostic de la semaine</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-primary--dark join-hebdo-bet__title-section">
            <div class="text-white text-bold text-center join-hebdo-bet__title">{{ bet.label }}</div>
          </q-card-section>
        </q-card>
        <div class="join-hebdo-bet__choices-container flex flex-center column">
          <q-btn
            v-for="choice in bet.choices"
            :key="choice.id"
            :label="format.capitalize(choice.label)"
            :class="`join-hebdo-bet__choice-btn btn bg-${idChoiceChosen === choice.id ? 'primary' : 'white'} ${
              idChoiceChosen === choice.id ? 'chosen text-bold text-white' : ''
            }`"
            rounded
            @click.prevent="idChoiceChosen = choice.id"
            :loading="loading"
            padding="sm"
            size="20px"
          />
        </div>
        <div class="join-hebdo-bet__submit-container text-center">
          <q-btn
            label="Valider le choix"
            type="submit"
            :class="`q-mb-sm text-bold form-btn btn btn-${this.idChoiceChosen ? 'secondary' : 'disabled'}`"
            :disable="!this.idChoiceChosen"
            rounded
            @click.prevent="joinBet()"
            :loading="joinBetLoading"
            padding="sm 50px"
            size="20px"
          />
          <p class="text-white text-small q-mb-0">Ce pari vous permettra de gagner {{ bet.tokenReward }} smiles 😊</p>
          <p class="text-white text-small q-mb-0">(si vous le gagner 😉)</p>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { Loading, Notify } from 'quasar'
import { useRoute } from 'vue-router'
import translate from '../../stores/translatting'
import { getMyParticipation, participate, updateParticipation } from 'src/services/participationService'
import { getHebdoBetById } from 'src/services/betService'
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
      joinBetLoading: false,
      participationId: null
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    joinBet() {
      this.joinBetLoading = true
      if (this.participationId) {
        return updateParticipation(this.participationId, this.route.params.id, 'hebdo_bets', this.idChoiceChosen)
          .then(() => {
            this.joinBetLoading = false
            Notify.create({
              message: 'Votre participation au pari hebdomadaire a bien été modifiée',
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
            return this.$router.push({ name: 'home' })
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
            console.log(err)
          })
      }
      participate(this.route.params.id, this.idChoiceChosen, 0, 'hebdo_bets')
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
          return this.$router.push({ name: 'home' })
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
      await getHebdoBetById(this.route.params.id)
        .then((res) => {
          this.bet = res
          getBetChoices(this.route.params.id, 'hebdo_bets').then((res) => {
            this.bet.choices = res
          })
          Loading.hide()
        })
        .catch((err) => {
          Loading.hide()
          Notify.create({
            message: translate().translateGetHebdoBetsError(err),
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
          return this.$router.push({ name: 'home' })
        })

      const participation = await getMyParticipation(this.route.params.id, 'hebdo_bets').catch((err) => {
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
        return this.$router.push({ name: 'home' })
      })
      this.participationId = participation ? participation.id : null
      this.idChoiceChosen = participation ? participation.choice.id : null
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
.join-hebdo-bet {
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
</style>
