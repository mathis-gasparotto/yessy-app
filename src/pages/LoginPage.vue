<template>
  <q-page class="flex flex-center">
    <q-form class="flex flex-center column" ref="loginForm">
      <q-input
        name="username"
        rounded
        outlined
        label="Nom d'utilisateur"
        autofocus
        class="q-mb-md"
        type="text"
        v-model="username"
        :rules="[(val) => val.length <= 0 || 'Veullez remplir tous les champs']"
        lazy-rules
      ></q-input>
      <q-input
        name="password"
        rounded
        outlined
        label="Mot de passe"
        class="q-mb-md"
        type="password"
        v-model="password"
        :rules="[(val) => val.length <= 0 || 'Veullez remplir tous les champs']"
        lazy-rules
      ></q-input>
      <q-btn
        label="Se connecter"
        type="submit"
        color="secondary"
        rounded
        @click.prevent="onsubmit()"
      />
    </q-form>
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
    };
  },
  methods: {
    onsubmit() {
      console.log("onsubmit");
      this.$refs.loginForm.validate().then((success) => {
        if (success) {
          console.log("success");
        } else {
          console.log("error");
        }
      });
    },
  },
};
</script>
