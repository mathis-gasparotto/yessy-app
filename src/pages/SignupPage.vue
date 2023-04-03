<template>
  <q-page class="flex flex-center column">
    <q-form class="flex flex-center column" ref="signupForm">
      <q-input name="username" rounded outlined label="Nom d'utilisateur*" autofocus class="q-mb-md" type="text"
        v-model="form.username" :rules="[(val) => val.length > 3 || 'Veullez renseigner au minimum 3 caractères']"
        lazy-rules :input-style="{
          width: '250px'
        }" hide-bottom-space></q-input>
      <q-input rounded outlined v-model="form.birthday" mask="date" lazy-rules :rules="['date']"
        label="Date d'anniversaire*" class="q-mb-md" :input-style="{ width: '214px' }" hide-bottom-space>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="form.birthday">
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
        :input-style="{
          width: '250px'
        }" hide-bottom-space></q-input>
      <q-input name="password" rounded outlined label="Mot de passe*" class="q-mb-md" type="password"
        v-model="form.password" :rules="[(val) => val.length > 0 || 'Veullez remplir ce champ']" lazy-rules :input-style="{
          width: '250px'
        }" hide-bottom-space></q-input>
      <q-input name="referralCode" rounded outlined label="Code de parrainage" class="q-mb-md" type="text"
        v-model="form.referralCode" :input-style="{
          width: '250px'
        }" hide-bottom-space></q-input>
      <q-btn label="S'inscrire" type="submit" :color="(validate ? 'secondary' : 'grey')" :disable="!validate" rounded
        @click.prevent="onsubmit()" :loading="loading" padding="sm 50px" size="20px" class="q-mb-xl" />
    </q-form>
    <p class="flex-end">*Champ obligatoire</p>
    <p>Tu as déjà un compte ? <router-link to="/logib">Connecte toi</router-link></p>
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
        referralCode: ""
      },
      loading: false,
      validate: false
    };
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
