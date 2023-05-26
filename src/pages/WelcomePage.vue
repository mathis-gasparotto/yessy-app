<template>
  <q-container
    class="flex flex-center column"
    :style="{ color: 'white', width: '100%' }"
  >
    <q-img
      src="~assets/logo_yessy_carre.png"
      style="width: 200px; height: 200px"
    ></q-img>
    <q-container class="q-my-xl">
      <p class="text-h2 text-bold">Vivez</p>
      <p class="text-h2 text-bold">Jouer</p>
      <p class="text-h2 text-bold">Pariez</p>
    </q-container>
    <q-btn
      label="Se connecter"
      type="button"
      text-color="secondary"
      color="white"
      rounded
      @click.prevent="$router.push({ name: 'login' })"
      :loading="loading"
      padding="xs 50px"
      size="22px"
      class="q-mb-md text-bold btn btn-secondary btn-bordered"
    />
    <q-btn
      label="S'inscrire"
      type="button"
      color="secondary"
      rounded
      @click.prevent="$router.push({ name: 'signup' })"
      :loading="loading"
      padding="sm 50px"
      size="22px"
      class="text-bold btn btn-secondary"
    />
  </q-container>
</template>

<script>
// import { cp } from "fs"

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    onsubmit() {
      this.loading = true
      this.$refs.loginForm.validate().then((success) => {
        if (success) {
          console.log(`username: ${this.username}
          password: ${this.password}`)
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
.btn {
  width: 75%;
}
</style>
