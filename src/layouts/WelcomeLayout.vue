<template>
  <q-layout
    view="lHh Lpr lFf"
    :class="this.$route.name === 'signup' ? 'bg-white' : 'bg-primary'"
  >
    <q-page-container>
      <q-page class="flex flex-center column">
        <router-view class="q-py-md" />
        <q-container
          class="flex flex-center column q-py-md bg-transparent"
          :style="{ color: this.$route.name === 'signup' ? 'black' : 'white' }"
        >
          <div class="q-mb-sm">
            <q-btn
              unelevated
              :style="{ textTransform: 'unset', lineHeight: '1rem' }"
              class="text-h6"
              padding="0"
              @click="openURL('https://yessy.fr')"
              >yessy.fr</q-btn
            >
          </div>
          <div>
            <q-btn
              unelevated
              :style="{ textTransform: 'unset', lineHeight: '1rem' }"
              padding="0"
              @click="openURL('https://yessy.fr')"
              >Mentions légales</q-btn
            >
            /
            <q-btn
              unelevated
              :style="{ textTransform: 'unset', lineHeight: '1rem' }"
              padding="0"
              @click="openURL('https://yessy.fr')"
              >RGPD</q-btn
            >
            /
            <q-btn
              unelevated
              :style="{ textTransform: 'unset', lineHeight: '1rem' }"
              padding="0"
              @click="openURL('https://yessy.fr')"
              >FAQ</q-btn
            >
          </div>
        </q-container>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
export default {
  name: "WelcomeLayout",
  created() {
    console.log();
  },
  methods: {
    openURL(url) {
      openURL(url);
    },
  },
};
</script>
