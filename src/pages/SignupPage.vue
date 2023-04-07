<template>
  <q-page class="flex flex-center column">
    <p class="text-h6 q-py-md bg-primary text-center text-bold"
      :style="{ width: '300px', color: 'white', borderRadius: '15px' }">
      Inscription
    </p>
    <q-form class="flex flex-center column" ref="signupForm">
      <q-input name="username" rounded outlined label="Nom d'utilisateur*" autofocus class="q-mb-md" type="text"
        v-model="form.username" :rules="[(val) => val.length > 3 || 'Veullez renseigner au minimum 3 caractères']"
        lazy-rules :style="{ width: '300px' }" hide-bottom-space></q-input>
      <q-input rounded outlined v-model="form.birthday" mask="date" lazy-rules :rules="[(val) => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) || 'Veullez renseigner une date valide', (val) => {
        const date = new Date(val)
        const min = new Date()
        min.setFullYear(min.getFullYear() - 16)
        return date < min || 'Cette application est réservée aux personnes de plus de 16 ans'
      }, (val) => {
        const date = new Date(val)
        const max = new Date()
        max.setFullYear(max.getFullYear() - 100)
        return date >= max || 'Veuillez renseigner votre vrai date de naissance'
      }]" label="Date d'anniversaire*" class="q-mb-md" :style="{ width: '300px' }" hide-bottom-space>
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
        :rules="[(val, rules) => rules.email(val) || 'Veullez rensigner une addresse email valide']" lazy-rules
        :style="{ width: '300px' }" hide-bottom-space></q-input>
      <q-input name="password" rounded outlined label="Mot de passe*" class="q-mb-md" type="password"
        v-model="form.password" :rules="[(val) => val.length > 0 || 'Veullez remplir ce champ']" lazy-rules
        :style="{ width: '300px' }" hide-bottom-space></q-input>
      <q-input name="referralCode" rounded outlined label="Code de parrainage" class="q-mb-md" type="text"
        v-model="form.referralCode" :style="{ width: '300px' }" hide-bottom-space></q-input>
      <p class="flex-end text-right" :style="{ width: '300px' }">*Champ obligatoire</p>
      <q-toggle v-model="form.minAgeCheck"
        label="Je certifie d’avoir plus de 14 ans. J’ai lu et j’accepte les conditions générales."
        :style="{ width: '300px' }" />
      <q-toggle v-model="form.newsletterCheck"
        label="J’accepte de recevoir le bonus d’inscription, les offres spéciales et les informations de la part de Yessy."
        class="q-mb-lg" :style="{ width: '300px' }" />

      <q-btn label="S'inscrire" type="submit" :style="{ textTransform: 'unset' }"
        :color="(validate ? 'secondary' : 'grey')" :disable="!validate" rounded @click.prevent="onsubmit()"
        :loading="loading" padding="sm 50px" size="20px" />
    </q-form>
    <!-- <p>Tu as déjà un compte ? <router-link to="/login">Connecte toi</router-link></p> -->
  </q-page>
</template>

<script>
// import { cp } from "fs";

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
      validate: false
    };
  },
  created() {
    // this.$store.commit("setPageTitle", "Inscription");
  },
  watch: {
    form: {
      handler(oldVal, newVal) {
        this.$refs.signupForm.validate().then((success) => {
          if (success) {
            this.validate = true
          } else {
            this.validate = false
          }
          console.log(this.validate);
        });
      },
      deep: true
    },
  },
  methods: {
    onsubmit() {
      this.loading = true
      this.$refs.signupForm.validate().then((success) => {
        if (success) {
          console.log(`username: ${this.username}
          password: ${this.password}`);
        } else {
          console.log("error");
          this.loading = false
        }
      });
    },
  },
};
</script>
