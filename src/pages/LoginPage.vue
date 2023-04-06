<template>
  <q-page class="flex flex-center">
    <q-img src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px"></q-img>
    <q-form class="flex flex-center column" ref="loginForm">
      <q-input name="username" rounded outlined label="Nom d'utilisateur*" autofocus class="q-mb-md" type="text"
        v-model="username" :rules="[(val) => val.length > 0 || 'Veullez remplir ce champ']" lazy-rules :input-style="{
          width: '250px'
        }" hide-bottom-space></q-input>
      <q-input name="password" rounded outlined label="Mot de passe*" class="q-mb-md" type="password" v-model="password"
        :rules="[(val) => val.length > 0 || 'Veullez remplir ce champ']" lazy-rules :input-style="{
          width: '250px'
        }" hide-bottom-space></q-input>
      <q-btn label="Se connecter" type="submit" color="secondary" rounded @click.prevent="onsubmit()" :loading="loading"
        padding="sm 50px" size="18px" />
    </q-form>
    <router-link to="#">Mot de passe oublié ?</router-link>
    <p>Tu n’as pas de compte ? <router-link to="/signup">Inscris toi</router-link></p>
  </q-page>
</template>

<script>
// import { cp } from "fs";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      loading: false
    };
  },
  methods: {
    onsubmit() {
      this.loading = true
      this.$refs.loginForm.validate().then((success) => {
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
