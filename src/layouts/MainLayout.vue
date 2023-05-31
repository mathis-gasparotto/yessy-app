<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Yessy
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <div class="daily-login__container fixed-full" @click="showDailyLoginProgress = false" v-if="showDailyLoginProgress"></div>
    <div class="daily-login__wrapper flex column items-center fixed" v-if="showDailyLoginProgress">
      <q-btn
        rounded
        class="daily-login__close-btn absolute"
        icon="close"
        color="secondary"
        text-color="white"
        @click-prevent="showDailyLoginProgress = false"
        size="13px"
        @click="showDailyLoginProgress = false"
      ></q-btn>
      <div class="daily-login__token-count-container flex flex-center column text-white">
        <span class="daily-login_token-count text-center text-bold text-h6">{{ tokenGain }}</span>
        <q-icon name="fa fa-coins" size="md"></q-icon>
      </div>
      <p class="text-h6 text-white q-mb-0">Récompense de connexion</p>
      <p class="text-white text-small q-mb-lg">Série de {{ loginStreak }} jours de connexion</p>
      <div class="daily-login__graph-container">
        <q-linear-progress
          color="secondary"
          size="10px"
          :value="dailyLoginLinearProgress"
          rounded
          track-color="white"
          class="daily-login__graph"
        >
        </q-linear-progress>
        <div class="daily-login__graph-steps-container">
          <div class=" flex items-center justify-between">
            <span :class="`daily-login__graph-steps ${loginStreak >= 1 ? 'btn-secondary' : 'btn-white'} flex flex-center`">1</span>
            <span :class="`daily-login__graph-steps ${loginStreak >= 7 ? 'btn-secondary' : 'btn-white'} flex flex-center`">7</span>
            <span :class="`daily-login__graph-steps ${loginStreak >= 14 ? 'btn-secondary' : 'btn-white'} flex flex-center`">14</span>
            <span :class="`daily-login__graph-steps ${loginStreak >= 30 ? 'btn-secondary' : 'btn-white'} flex flex-center`">30</span>
          </div>
          <div class="flex items-center justify-between daily-login__graph-steps-label-container">
            <span class="daily-login__graph-steps-label text-white text-small q-mb-0">{{ tokenGainPerDay }} smiles/jour</span>
            <span class="daily-login__graph-steps-label text-white text-small q-mb-0">{{ tokenGainPerDayAfter7Days }} smiles/jour</span>
            <span class="daily-login__graph-steps-label text-white text-small q-mb-0">{{ tokenGainPerDayAfter14Days }} smiles/jour</span>
            <span class="daily-login__graph-steps-label text-white text-small q-mb-0">{{ tokenGainPerDayAfter30Days }} smiles/{{ tokenGainFrequencyAfter30Days }} jours</span>
          </div>
        </div>
        <div class="absolute flex flex-center daily-login__graph-progress-value" :style="`--daily-login-progress: ${dailyLoginLinearProgress}`">
          <q-badge color="secondary" text-color="white" :label="loginStreak" />
        </div>
      </div>
    </div>

    <q-footer class="nav-bar-container">
      <q-tabs align="center" class="bg-dark nav-bar" indicator-color="transparent" active-color="secondary">
        <q-route-tab :to="{ name: 'home' }" icon="home" label="Accueil" />
        <q-route-tab :to="{ name: 'public-bets' }" icon="fa fa-trophy" label="Paris" />
        <!-- <q-route-tab :to="{name: 'friends'}" label="Amis" /> -->
        <!-- <q-route-tab :to="{name: 'shop'}" label="Boutique" /> -->
        <q-route-tab :to="{ name: 'account' }" icon="account_circle" label="Compte" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { dailyLogin } from 'src/services/dailyLoginService'
import { DAILY_TOKEN_GAIN, DAILY_TOKEN_GAIN_AFTER_7_DAYS, DAILY_TOKEN_GAIN_AFTER_14_DAYS, DAILY_TOKEN_GAIN_AFTER_30_DAYS, DAILY_TOKEN_GAIN_FREQUENCY_AFTER_30_DAYS } from 'src/stores/constants'

export default {
  name: 'MainLayout',
  data() {
    return {
      showDailyLoginProgress: false,
      loginStreak: null,
      tokenGain: null,
      tokenGainPerDay: DAILY_TOKEN_GAIN,
      tokenGainPerDayAfter7Days: DAILY_TOKEN_GAIN_AFTER_7_DAYS,
      tokenGainPerDayAfter14Days: DAILY_TOKEN_GAIN_AFTER_14_DAYS,
      tokenGainPerDayAfter30Days: DAILY_TOKEN_GAIN_AFTER_30_DAYS,
      tokenGainFrequencyAfter30Days: DAILY_TOKEN_GAIN_FREQUENCY_AFTER_30_DAYS
    }
  },
  watch: {
    showDailyLoginProgress() {
      if (this.showDailyLoginProgress === true) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  async created() {
    const dailyLoginData = await dailyLogin()
    if (dailyLoginData.loginStreak && dailyLoginData.tokenGain) {
      this.tokenGain = dailyLoginData.tokenGain
      this.loginStreak = dailyLoginData.loginStreak
      this.showDailyLoginProgress = true
      document.body.style.overflow = 'hidden'
    }
  },
  computed: {
    dailyLoginLinearProgress() {
      if (this.loginStreak === 1) {
        return 0
      } else if (this.loginStreak <= 7) {
        return (this.loginStreak - 1) / 6 * 0.3333
      } else if (this.loginStreak <= 14) {
        return (this.loginStreak - 7) / 7 * 0.3333 + 0.3333
      } else if (this.loginStreak <= 30) {
        return (this.loginStreak - 14) / 16 * 0.3333 + 0.6666
      } else {
        return 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  border-radius: 20px 20px 0 0;
  &-container {
    background-color: transparent;
    .q-tab {
      flex: 1 1 auto;
      &__label {
        font-size: 16px;
        font-weight: 300;
      }
    }
  }
}
.daily-login {
  &__container {
    z-index: 100;
    display: flex;
    align-items: flex-end;
  }
  &__wrapper {
    z-index: 105;
    // position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-bottom: 43px;
    background: url('src/assets/daily-login-bg.png') no-repeat center top/cover;
    padding: 20px 30px 40px 30px;
  }
  &__close-btn {
    top: 10px;
    right: 15%;
    width: 34px;
    height: 34px;
  }
  &__token-count {
    &-container {
      padding: 10px;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      background: url('/src/assets/token-bg.svg') no-repeat center center/cover;
    }
  }
  &__graph {
    width: calc(100% - 30px);
    margin: auto;
    border-radius: 5000px;
    &-container {
      width: 100%;
      position: relative;
      // padding-bottom: 30px;
    }
    &-progress-value {
      position: absolute;
      left: calc(var(--daily-login-progress) * calc(100% - 30px) - 12.5px + 15px);
      top: -8px;
      width: 25px;
      height: 25px;
      .q-badge {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        margin: auto;
        font-size: 12px;
        font-weight: 500;
      }
    }
    &-steps {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #fff;
      &-container {
        margin-top: -20px;
        z-index: 1;
        position: relative;
      }
      &-label {
        &-container {
          margin-top: 5px;
          margin-left: -5%;
          width: 110%;
        }
      }
    }
  }
}
</style>
