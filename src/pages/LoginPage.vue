<template>
  <q-container class="flex flex-center column bg-primary login-page page">
    <q-img
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
      class="q-mb-xl"
    ></q-img>
    <q-form class="flex flex-center column form login-form" ref="loginForm" @submit.prevent="onsubmit()">
      <q-input
        name="email"
        rounded
        outlined
        label="Adresse mail"
        autofocus
        class="q-mb-md login-input"
        type="text"
        v-model="form.email"
        :rules="[
          (val, rules) =>
            rules.email(val) || 'Veullez rensigner une addresse email valide'
        ]"
        lazy-rules
        hide-bottom-space
      ></q-input>
      <q-input
        name="password"
        rounded
        outlined
        label="Mot de passe"
        class="q-mb-md login-input"
        type="password"
        v-model="form.password"
        :rules="[(val) => val.length > 0 || 'Veullez remplir ce champ']"
        lazy-rules
        hide-bottom-space
      ></q-input>
      <q-btn
        label="Se connecter"
        type="submit"
        rounded
        :loading="loading"
        padding="sm 50px"
        size="18px"
        :disable="!validate"
        :class="`form-btn btn btn-${validate ? 'secondary' : 'disabled'}`"
      />
    </q-form>
    <q-card flat>
      <q-card-section>
        <p class="q-my-xs text-center">
          <router-link to="#">Mot de passe oublié ?</router-link>
        </p>
      </q-card-section>
      <q-separator spaced size="2px" color="white" rounded />
      <q-card-section>
        <p class="q-my-xs text-center">
          Tu n'as pas de compte ? <router-link :to="{ name: 'signup' }" class="text-bold">Inscris toi</router-link>
        </p>
      </q-card-section>
    </q-card>
  </q-container>
</template>

<script>
import { login } from 'src/boot/firebase'
import translate from '../stores/translatting.js'
import { LocalStorage, Notify } from 'quasar'
// import { cp } from "fs";

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      validate: false
    }
  },
  watch: {
    form: {
      handler() {
        if (this.form.email && this.form.password) {
          this.$refs.loginForm.validate().then((success) => {
            if (success) {
              this.validate = true
            } else {
              this.validate = false
            }
          })
          this.validate = true
        } else {
          this.validate = false
        }
      },
      deep: true
    }
  },
  methods: {
    onsubmit() {
      this.loading = true
      this.$refs.loginForm.validate().then((success) => {
        if (success) {
          login(this.form.email, this.form.password).then((user) => {
            this.loading = false
            LocalStorage.set('user', {
              uid: user.uid,
              username: user.username,
              birthday: user.birthday,
              email: user.email,
              referralCode: user.referralCode,
              newsletter: user.newsletterCheck
            })
            this.$router.push({ name: 'home' })
          }).catch((err) => {
            this.loading = false
            Notify.create({
              message: translate().translateSigninError(err.code),
              color: 'negative',
              icon: 'report_problem',
              timeout: 5000
            })
          })
        } else {
          console.log('error')
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  color: white;
}
</style>
