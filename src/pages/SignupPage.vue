<template>
  <q-container class="flex flex-center column">
    <p class="text-h6 q-py-md bg-primary text-center text-bold"
      :style="{ width: '75%', color: 'white', borderRadius: '15px' }">
      Inscription
    </p>
    <q-form class="flex flex-center column" ref="signupForm">
      <q-input name="username" rounded outlined label="Nom d'utilisateur*" autofocus class="q-mb-md" type="text"
        v-model="form.username" lazy-rules :rules="[
          (val) =>
            val.length > 3 || 'Veullez renseigner au minimum 3 caractères',
        ]" :style="{ width: '75%' }" hide-bottom-space></q-input>
      <q-input rounded outlined v-model="form.birthday" mask="date" lazy-rules :rules="[
        (val) =>
          /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) ||
          'Veullez renseigner une date valide',
        (val) => {
          const date = new Date(val)
          const min = new Date()
          min.setFullYear(min.getFullYear() - 16)
          return (
            date < min ||
            'Cette application est réservée aux personnes de plus de 16 ans'
          )
        },
        (val) => {
          const date = new Date(val)
          const max = new Date()
          max.setFullYear(max.getFullYear() - 100)
          return (
            date >= max || 'Veuillez renseigner votre vrai date de naissance'
          )
        },
      ]" label="Date d'anniversaire*" class="q-mb-md" :style="{ width: '75%' }" hide-bottom-space>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="form.birthday" navigation-max-year-month="2023/01">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input name="email" rounded outlined label="Addresse email*" class="q-mb-md" type="text" v-model="form.email"
        lazy-rules :rules="[
          (val, rules) =>
            rules.email(val) || 'Veullez rensigner une addresse email valide',
        ]" :style="{ width: '75%' }" hide-bottom-space></q-input>
      <q-input name="password" rounded outlined label="Mot de passe*" class="q-mb-md"
        :type="showPassword ? 'text' : 'password'" v-model="form.password" lazy-rules
        hint="8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial" hide-hint :rules="[
          (val) => val.length > 0 || 'Veullez remplir ce champ',
          (val) =>
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/g.test(val) ||
            'Veullez renseigner un mot de passe contetant un caractère spécial, une majuscule, une minuscule et un chiffre, et d\'au moins 8 caractères',
        ]" :style="{ width: '75%' }" hide-bottom-space>
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>
      <q-input name="referralCode" rounded outlined label="Code de parrainage" class="q-mb-md" type="text"
        v-model="form.referralCode" :style="{ width: '75%' }" hide-bottom-space></q-input>

      <p class="flex-end text-right" :style="{ width: '75%' }">
        *Champ obligatoire
      </p>
      <q-toggle v-model="form.minAgeCheck" :style="{ width: '75%' }" class="q-mb-md">
        <p>
          Je certifie d'avoir plus de 14 ans. J'ai lu et j'accepte les
          <router-link to="/login" class="text-underline">conditions générales</router-link>.
        </p>
      </q-toggle>
      <q-toggle v-model="form.newsletterCheck"
        label="J'accepte de recevoir le bonus d'inscription, les offres spéciales et les informations de la part de Yessy."
        class="q-mb-lg" :style="{ width: '75%' }" />

      <q-btn label="S'inscrire" type="submit" :style="{ textTransform: 'unset' }" :color="validate ? 'secondary' : 'grey'"
        :disable="!validate" rounded @click.prevent="onsubmit()" :loading="loading" padding="sm 50px" size="20px" />
    </q-form>
    <!-- <p>Tu as déjà un compte ? <router-link to="/login">Connecte toi</router-link></p> -->
  </q-container>
</template>

<script>
// import { cp } from "fs"

export default {
  name: "SignupPage",
  data() {
    return {
      form: {
        username: "",
        birthday: "",
        email: "",
        password: "",
        referralCode: "",
        minAgeCheck: false,
        newsletterCheck: false,
      },
      loading: false,
      validate: false,
      showPassword: false,
    }
  },
  created() {
    // this.$store.commit("setPageTitle", "Inscription")
  },
  watch: {
    form: {
      handler() {
        if (this.form.minAgeCheck && this.form.username && this.form.birthday && this.form.email && this.form.password) {
          this.$refs.signupForm.validate().then((success) => {
            if (success) {
              this.validate = true
            } else {
              this.validate = false
            }
          })
        }
      },
      deep: true,
    },
  },
  methods: {
    onsubmit() {
      this.loading = true
      this.$refs.signupForm.validate().then((success) => {
        if (success) {
          console.log(`username: ${this.username}
          password: ${this.password}`)
        } else {
          console.log("error")
          this.loading = false
        }
      })
    },
  },
}
</script>
