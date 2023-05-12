<template>
  <div class="page-container">
    <q-page class="flex flex-center">
      <div class="page-content">
        Account
        {{ user.uid }}
        <img
          alt="Quasar logo"
          src="~assets/quasar-logo-vertical.svg"
          style="width: 200px; height: 200px"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'AccountPage',
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.user = LocalStorage.getItem('user')
    console.log(this.user)
  }
}
</script>
