<template>
  <div class="page-container">
    <q-page class="flex flex-center">
      <div class="page-content">
        {{ user.uid }}
        {{ user.email }}
        {{ user.username }}
        {{ format.dateFormatFromBDD(user.birthday) }}
        {{ user.referralCode }}
        {{ user.newsletter }}
      </div>
    </q-page>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import createFormat from '../stores/formatting.js'

export default {
  name: 'AccountPage',
  data() {
    return {
      user: {},
      format: createFormat()
    }
  },
  created() {
    this.user = LocalStorage.getItem('user')
    console.log(this.user)
  }
}
</script>
