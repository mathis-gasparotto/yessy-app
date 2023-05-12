<template>
  <div class="page-container bg-2 single-bet">
    <q-page class="page flex flex-center column">
      <div class="page-content">
        <div class="single-bet__title-container">
          <img
            class="single-bet__privacy"
            src="~assets/quasar-logo-vertical.svg"
          />
          <div class="single-bet__title-text">
            <h1 class="single-bet__title text-h6">{{ bet.label }}</h1>
          </div>
        </div>
        <!-- <p class="single-bet__subtitle">
          <span class="single-bet__created-by">créé par</span> <span class="single-bet__author">{{ bet.author.pseudo }}</span>
        </p> -->
        <q-list class="single-bet__props">
          <q-item class="single-bet__prop">
            <!-- <span class="single-bet__prop-icon-container">
              <img class="single-bet__prop-icon" :src="bet.category.iconUrl" />
            </span>
            <p class="single-bet__prop-text">{{ bet.category.label }}</p> -->
          </q-item>
          <q-item class="single-bet__prop">
            <span class="single-bet__prop-icon-container">
              <img
                class="single-bet__prop-icon"
                src="~assets/quasar-logo-vertical.svg"
              />
            </span>
            <p class="single-bet__prop-text">{{ bet.description }}</p>
          </q-item>
          <q-item class="single-bet__prop" v-if="bet.customReward">
            <span class="single-bet__prop-icon-container">
              <img
                class="single-bet__prop-icon"
                src="~assets/quasar-logo-vertical.svg"
              />
            </span>
            <p class="single-bet__prop-text">{{ bet.customReward }}</p>
          </q-item>
          <q-item class="single-bet__prop" v-else-if="bet.tokenRewardOdd">
            <span class="single-bet__prop-icon-container">
              <img
                class="single-bet__prop-icon"
                src="~assets/quasar-logo-vertical.svg"
              />
            </span>
            <p class="single-bet__prop-text">
              La cote est de {{ bet.tokenRewardOdd }}
            </p>
          </q-item>
          <q-item class="single-bet__prop" v-if="bet.startAt">
            <span class="single-bet__prop-icon-container">
              <img
                class="single-bet__prop-icon"
                src="~assets/quasar-logo-vertical.svg"
              />
            </span>
            <p class="single-bet__prop-text">{{ createFormat.dateTimeFormatFromBDD(bet.startAt) }}</p>
          </q-item>
          <q-item class="single-bet__prop">
            <span class="single-bet__prop-icon-container">
              <img
                class="single-bet__prop-icon"
                src="~assets/quasar-logo-vertical.svg"
              />
            </span>
            <p class="single-bet__prop-text">{{ createFormat.dateTimeFormatFromBDD(bet.endAt) }}</p>
          </q-item>
          <q-item class="single-bet__prop" v-if="bet.customCost">
            <span class="single-bet__prop-icon-container">
              <img
                class="single-bet__prop-icon"
                src="~assets/quasar-logo-vertical.svg"
              />
            </span>
            <p class="single-bet__prop-text">{{ bet.customCost }}</p>
          </q-item>
        </q-list>
        <div class="single-bet__participants">
          <span class="single-bet__participants-count">{{
            bet.participants
          }}</span>
          participants
        </div>
        <q-btn
          label="Rejoindre le paris"
          type="button"
          color="secondary"
          rounded
          @click.prevent="joinBet()"
          :loading="joinLoading"
          padding="xs"
          class="text-bold btn btn-secondary single-bet__join-btn"
        />
        <q-btn
          label="Supprimer le paris"
          type="button"
          text-color="secondary"
          color="white"
          rounded
          @click.prevent="handleDeleteBet()"
          :loading="deleteLoading"
          padding="xs"
          class="q-mb-md text-bold btn btn-secondary btn-bordered single-bet__delete-btn"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import { Loading } from 'quasar'
import { getBet } from 'src/boot/firebase'
import { deleteBet } from 'src/boot/firebase'
import { useRoute } from 'vue-router'
import createFormat from '../../stores/formatting.js'

export default {
  setup() {
    const route = useRoute()

    return {
      route
    }
  },
  name: 'SingleBetPage',
  data() {
    return {
      // bet: {
      //   id: 1,
      //   label: 'Qui va remporter la coupe du monde 2026 ?',
      //   description: 'Description 1',
      //   privacy: 'public',
      //   author: {
      //     id: 1,
      //     pseudo: 'John Doe',
      //     avatarPath: '/src/assets/quasar-logo-vertical.svg'
      //   },
      //   category: {
      //     id: 1,
      //     label: 'Sport',
      //     iconUrl: '/src/assets/quasar-logo-vertical.svg'
      //   },
      //   customReward: 'Le gagnant obtiendra un skin',
      //   endAt: '2023-03-11T12:00:00',
      //   participants: 86
      // },
      bet: {},
      joinLoading: false,
      deleteLoading: false,
      createFormat: createFormat()
    }
  },
  created() {
    Loading.show()
    this.reloadData()
  },
  methods: {
    joinBet() {
      this.joinLoading = true
      console.log('join bet')
    },
    reloadData() {
      getBet(this.route.params.id).then((res) => {
        this.bet = {
          ...res,
          author: {
            id: 1,
            pseudo: 'John Doe',
            avatarPath: '/src/assets/quasar-logo-vertical.svg'
          },
          category: {
            id: 1,
            title: 'Sport',
            iconUrl: '/src/assets/quasar-logo-vertical.svg'
          }
        }
        Loading.hide()
      }).catch(() => {
        Loading.hide()
        this.$router.push({ name: 'public-bets' })
      })
    },
    handleDeleteBet() {
      this.deleteLoading = true
      deleteBet(this.route.params.id).then(() => {
        this.deleteLoading = false
        this.$router.push({ name: 'public-bets' })
      }).catch((e) => {
        console.error(e)
        this.deleteLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 50px;
  height: 50px;
}
.single-bet {
  &__title {
    &-container {
      display: flex;
      width: 75%;
      gap: 10px;
    }
    margin: 0;
    line-height: 1em;
    font-weight: 900;
    color: $primary;
  }
  &__subtitle {
    margin: auto;
    margin: 5px 0 20px;
  }
  &__created-by {
    color: $primary;
  }
  &__privacy {
    width: 25px;
    height: 25px;
    padding: 5px;
    fill: white;
    stroke: white;
    background-color: $secondary;
    border: 2px solid white;
    border-radius: 5px;
  }
  &__prop {
    &-icon {
      &-container {
        margin-right: 10px;
      }
    }
    &s {
      width: 100%;
    }
  }
  &__participants {
    margin: 20px 0;
    color: white;
    background-color: $primary;
    padding: 8px;
    width: 100%;
    border-radius: 10px;
    text-align: center;
    font-size: 1.5em;
    font-weight: 200;
    &-count {
      font-weight: 300;
      font-size: 1.7rem;
    }
  }
  &__join-btn {
    width: 100%;
    font-size: 1.2rem;
  }
  &__delete-btn {
    width: 100%;
    font-size: 1.2rem;
    margin-top: 20px;
  }
}
</style>
