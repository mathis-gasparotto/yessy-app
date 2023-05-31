<template>
  <q-container class="flex flex-center column page">
    <p class="text-h6 q-py-md bg-primary text-center text-bold title">
      Inscription
    </p>
    <q-form class="flex flex-center column form signup-form" ref="signupForm" @submit.prevent="onsubmit()">
      <q-input
        name="username"
        rounded
        outlined
        label="Nom d'utilisateur*"
        autofocus
        class="q-mb-md signup-input bg-white"
        type="text"
        v-model="form.username"
        lazy-rules
        :rules="[
          (val) => val.trim().length > 3 || 'Veullez renseigner minimum 4 caractères'
        ]"
        hide-bottom-space
      ></q-input>
      <q-input
        rounded
        outlined
        v-model="form.birthday"
        mask="date"
        lazy-rules
        :rules="[
          (val) =>
            /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) ||
            'Veullez renseigner une date valide',
          (val) => {
            const date = new Date(val)
            const min = new Date()
            min.setFullYear(min.getFullYear() - 18)
            return (
              date <= min ||
              'Cette application est réservée aux personnes majeures'
            )
          },
          (val) => {
            const date = new Date(val)
            const max = new Date()
            max.setFullYear(max.getFullYear() - 100)
            return (
              date >= max || 'Veuillez renseigner votre vrai date de naissance'
            )
          }
        ]"
        label="Date d'anniversaire*"
        class="q-mb-md signup-input bg-white"
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer" color="secondary">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.birthday"
                navigation-max-year-month="2023/01"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fermer" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        name="email"
        rounded
        outlined
        label="Addresse email*"
        class="q-mb-md signup-input bg-white"
        type="text"
        v-model="form.email"
        lazy-rules
        :rules="[
          (val, rules) =>
            rules.email(val) || 'Veullez rensigner une addresse email valide'
        ]"
        hide-bottom-space
      ></q-input>
      <q-input
        name="password"
        rounded
        outlined
        label="Mot de passe*"
        class="q-mb-md signup-input bg-white"
        :type="showPassword ? 'text' : 'password'"
        v-model="form.password"
        lazy-rules
        hint="8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial"
        hide-hint
        :rules="[
          (val) => val.trim().length > 0 || 'Veullez remplir ce champ',
          (val) =>
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/g.test(val) ||
            'Veullez renseigner un mot de passe contetant un caractère spécial, une majuscule, une minuscule et un chiffre, et d\'au moins 8 caractères'
        ]"
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon
            :name="showPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            color="secondary"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>
      <q-input
        name="confirmPassword"
        rounded
        outlined
        label="Confirmation du mot de passe*"
        class="q-mb-md signup-input bg-white"
        :type="showConfirmPassword ? 'text' : 'password'"
        v-model="form.confirmPassword"
        lazy-rules
        :rules="[
          (val) => val.trim().length > 0 || 'Veullez remplir ce champ',
          (val) =>
            val === form.password || 'Veuillez confirmer votre mot de passe'
        ]"
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon
            :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            color="secondary"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </template>
      </q-input>
      <q-input
        name="referralCode"
        rounded
        outlined
        label="Code de parrainage"
        class="q-mb-md signup-input bg-white"
        type="text"
        v-model="form.referralCode"
        hide-bottom-space
      ></q-input>

      <p class="flex-end text-right signup-text">*Champ obligatoire</p>
      <q-toggle v-model="form.minAgeCheck" class="q-mb-md signup-toggle">
        <p>
          Je certifie d'avoir plus de 18 ans. J'ai lu et j'accepte les
          <span class="text-underline">conditions générales</span>.
        </p>
      </q-toggle>
      <q-toggle
        v-model="form.newsletterCheck"
        label="J'accepte de recevoir le bonus d'inscription, les offres spéciales et les informations de la part de Yessy."
        class="q-mb-lg signup-toggle"
      />

      <q-btn
        label="S'inscrire"
        type="submit"
        :class="`form-btn btn btn-${validate ? 'secondary' : 'disabled'}`"
        :disable="!validate"
        rounded
        :loading="loading"
        padding="sm 50px"
        size="20px"
      />
    </q-form>
    <p class="q-mt-lg">
      Tu as déjà un compte ?
      <router-link :to="{name: 'login'}" class="text-underline text-bold"
        >Connecte toi</router-link
      >
    </p>
  </q-container>
</template>

<script>
// import { cp } from "fs"
import { signup } from 'src/services/authService'
import translate from '../stores/translatting'
import { Notify } from 'quasar'

export default {
  name: 'SignupPage',
  data() {
    return {
      form: {
        username: '',
        birthday: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        minAgeCheck: false,
        newsletterCheck: false
      },
      loading: false,
      validate: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  watch: {
    form: {
      handler() {
        if (
          this.form.minAgeCheck &&
          this.form.username &&
          this.form.birthday &&
          this.form.email &&
          this.form.password &&
          this.form.confirmPassword
        ) {
          this.$refs.signupForm.validate().then((success) => {
            if (success) {
              this.validate = true
            } else {
              this.validate = false
            }
          })
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
      this.$refs.signupForm.validate().then((success) => {
        if (success) {
          signup(
            this.form.email,
            this.form.password,
            this.form.username,
            this.form.birthday,
            this.form.referralCode,
            this.form.newsletterCheck
          )
            .then(() => {
              this.$router.push({ name: 'home' })
              Notify.create({
                message: 'Vous avez bien été inscrit',
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
            })
            .catch((err) => {
              this.loading = false
              Notify.create({
                message: translate().translateSignupError(err),
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
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  width: 75%;
  color: white;
  border-radius: 15px;
}
</style>
