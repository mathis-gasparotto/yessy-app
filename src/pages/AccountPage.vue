<template>
  <div class="page-container">
    <q-page class="flex flex-center page">
      <div class="page-content" v-if="user.avatar">
        <div class="account__avatar-container">
          <q-img :src="user.avatar.imgUrl" class="account__avatar-img" />
        </div>
        {{ user.uid }}
        {{ user.email }}
        {{ user.username }}
        {{ user.birthday }}
        {{ user.referralCode }}
        {{ user.newsletter }}
      </div>
    </q-page>
  </div>
</template>

<script>
import { Loading, LocalStorage, Notify } from 'quasar'
import createFormat from '../stores/formatting.js'
import { getAvatar, getUser } from 'src/boot/firebase'

export default {
  name: 'AccountPage',
  data() {
    return {
      user: {},
      format: createFormat()
    }
  },
  async created() {
    Loading.show()
    await getUser(LocalStorage.getItem('user').uid).then((user) => {
      LocalStorage.set('user', user)
      this.user = user
    }).catch(() => {
      Notify.create({
        message: 'Une erreur est survenue',
        color: 'negative',
        icon: 'report_problem',
        timeout: 5000
      })
      Loading.hide()
    })
    getAvatar(this.user.avatarId).then((avatar) => {
      this.user.avatar = avatar
      console.log(this.user)
      Loading.hide()
    }).catch(() => {
      Notify.create({
        message: 'Une erreur est survenue',
        color: 'negative',
        icon: 'report_problem',
        timeout: 5000
      })
      Loading.hide()
    })
  }
}
</script>

<style lang="scss" scoped>
.account {
  &__avatar {
    &-container {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: auto;
    }
    &-img {
      border-radius: 50%;
      margin: auto;
    }
  }
}
.page {
  align-items: start;
  padding-top: 20px;
}
</style>
