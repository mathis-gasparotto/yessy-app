<template>
  <q-container
    class="flex flex-center column bg-primary login-page container"
  >
    <q-img
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
      class="q-mb-xl"
    ></q-img>
    <q-form
      class="flex flex-center column form login-form"
      ref="loginForm"
    >
      <q-input
        name="username"
        rounded
        outlined
        label="Nom d'utilisateur/adresse mail"
        autofocus
        class="q-mb-md login-input"
        type="text"
        v-model="form.username"
        :rules="[(val) => val.length > 0 || 'Veullez remplir ce champ']"
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
        :color="validate ? 'secondary' : 'grey'"
        rounded
        @click.prevent="onsubmit()"
        :loading="loading"
        padding="sm 50px"
        size="18px"
        class="form-btn"
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
          Tu n’as pas de compte ?
          <router-link to="/signup" class="text-bold">Inscris toi</router-link>
        </p>
      </q-card-section>
    </q-card>
  </q-container>
</template>

<script>
// import { cp } from "fs";

export default {
  name: "LoginPage",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loading: false,
      validate: false
    }
  },
  watch: {
    form: {
      handler() {
        if (this.form.username && this.form.password) {
          // this.$refs.loginForm.validate().then((success) => {
          //   if (success) {
          //     this.validate = true
          //   } else {
          //     this.validate = false
          //   }
          // })
          this.validate = true
        } else {
          this.validate = false
        }
      },
      deep: true,
    },
  },
  methods: {
    onsubmit() {
      this.loading = true
      this.$refs.loginForm.validate().then((success) => {
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

<style lang="scss" scoped>
.container {
  color: white;
}
</style>
