<template>
  <div class="page-container">
    <q-page class="flex flex-center page">
      <div class="page-content" v-if="user.avatar">
        <div class="account__avatar-container q-mb-md">
          <q-img :src="user.avatar.imgUrl" class="account__avatar-img" />
        </div>
        <div class="text-center account__username-container text-h6 q-mt-md">
          <p class="account__username q-mr-xs text-bold">
            {{ user.username }}
          </p>
          <q-icon name="edit" color="secondary"></q-icon>
        </div>
        <div class="account__details q-mt-xl">
          <div class="account_detail">
            <div class="account_detail__label text-h6 flex items-center">
              <p class="q-mb-0 text-bold q-mr-xs">Date de naissance</p>
              <q-icon name="edit" color="secondary"></q-icon>
            </div>
            <p class="account_detail__value">
              {{ format.dateToDisplay(user.birthday) }}
            </p>
          </div>
          <div class="account_detail">
            <div class="account_detail__label text-h6 flex items-center">
              <p class="q-mb-0 text-bold q-mr-xs">Adresse email</p>
              <q-icon name="edit" color="secondary" class="cickable" @click="forms.email.show = true; forms.email.value = user.email"></q-icon>
            </div>
            <q-form class="flex flex-center row form account-form" ref="updateEmailForm" v-if="forms.email.show" @submit.prevent="handleUpdateAccount({email: forms.email.value}); forms.email.show = false; forms.email.value = ''">
              <q-input
                name="email"
                outlined
                autofocus
                class="account-input"
                type="text"
                v-model="forms.email.value"
                lazy-rules
                :rules="[
                  (val, rules) =>
                    rules.email(val) || 'Veullez rensigner une addresse email valide'
                ]"
                hide-bottom-space
              ></q-input>
              <q-btn
                icon="save"
                type="submit"
                class="form-btn btn btn-primary account-submit"
                padding="md"
                />
                <q-btn
                icon="close"
                type="button"
                class="form-btn btn btn-secondary account-submit"
                padding="md"
                @click="forms.email.show = false; forms.email.value = ''"
              />
            </q-form>
            <p class="account_detail__value" v-else>{{ user.email }}</p>
          </div>
          <div class="account_detail">
            <div class="account_detail__label text-h6 flex items-center">
              <p class="q-mb-0 text-bold q-mr-xs">Mot de passe</p>
              <q-icon name="edit" color="secondary"></q-icon>
            </div>
            <p class="account_detail__value">************</p>
          </div>
        </div>
        <div class="account__toggles-container flex column">
          <q-toggle
            v-model="user.private"
            :label="`Compte ${user.private ? 'privé' : 'public'}`"
            color="primary"
            unchecked-icon="lock_open"
            checked-icon="lock"
            class="q-mb-md"
            size="60px"
            dense
            @update:model-value="handleUpdateAccount({ private: user.private })"
          />
          <q-toggle
            v-model="user.newsletter"
            label="Recevoir la newsletter"
            color="primary"
            class="q-mb-md"
          />
        </div>
        <div class="account__btns-container">
          <q-btn
            label="Supprimer le compte"
            type="button"
            text-color="secondary"
            color="white"
            rounded
            @click.prevent="handleDeleteAccount()"
            :loading="deleteLoading"
            size="20px"
            padding="xs"
            class="q-mb-md text-bold btn btn-secondary btn-bordered-thin btn-full-width btn-thin"
          />
          <q-btn
            label="Déconnexion"
            type="button"
            color="secondary"
            rounded
            @click.prevent="handleLogout()"
            :loading="logoutLoading"
            size="20px"
            padding="xs"
            class="text-bold btn btn-secondary btn-full-width btn-thin"
          />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { Loading, LocalStorage, Notify } from 'quasar'
import createFormat from '../stores/formatting.js'
import { getAvatar, getUser, logout, updateUser, deleteUserData } from 'src/boot/firebase'
import translate from '../stores/translatting.js'
import { getAuth, updatePassword } from 'firebase/auth'

export default {
  name: 'AccountPage',
  data() {
    return {
      user: {},
      format: createFormat(),
      logoutLoading: false,
      deleteLoading: false,
      forms: {
        birthday: {
          show: false,
          value: ''
        },
        email: {
          show: false,
          value: ''
        },
        password: {
          show: false,
          current: '',
          new: '',
          confirm: '',
          showPassword: false,
          showNewPassword: false,
          showConfirmPassword: false
        }
      }
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    async reloadData() {
      Loading.show()
      await getUser(LocalStorage.getItem('user').uid)
        .then((user) => {
          LocalStorage.set('user', user)
          this.user = user
        })
        .catch(() => {
          Notify.create({
            message: 'Une erreur est survenue',
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          Loading.hide()
          return
        })
      getAvatar(this.user.avatarId)
        .then((avatar) => {
          this.user.avatar = avatar
          Loading.hide()
        })
        .catch(() => {
          Notify.create({
            message: 'Une erreur est survenue',
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          Loading.hide()
        })
    },
    handleLogout() {
      this.logoutLoading = true
      logout()
        .then(() => {
          this.$router.push({ name: 'login' })
        })
        .catch((err) => {
          this.logoutLoading = false
          Notify.create({
            message: translate().translateLogoutError(err),
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
        })
    },
    async handleDeleteAccount() {
      this.deleteLoading = true
      await deleteUserData(this.user.uid)
        .catch((err) => {
          this.deleteLoading = false
          Notify.create({
            message: translate().translateDeleteUserError(err),
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          return
        })
      logout()
        .then(() => {
          Notify.create({
            message: 'Votre compte a bien été supprimé',
            color: 'positive',
            icon: 'check_circle',
            timeout: 5000,
            position: 'top',
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
        })
        .catch((err) => {
          this.deleteLoading = false
          Notify.create({
            message: translate().translateLogoutError(err),
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
        })
    },
    async handleUpdateAccount(payload) {
      Loading.show()
      await updateUser(this.user.uid, payload)
        .then(() => {
          Notify.create({
            message: 'Votre compte a bien été mis à jour',
            color: 'positive',
            icon: 'check_circle',
            timeout: 5000,
            position: 'top',
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
        })
        .catch(() => {
          Loading.hide()
          Notify.create({
            message: 'Une erreur est survenue',
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          return
        })
      getUser(LocalStorage.getItem('user').uid)
        .then((user) => {
          LocalStorage.set('user', user)
          this.user = {
            avatar: this.user.avatar,
            ...user
          }
          Loading.hide()
        })
        .catch(() => {
          Notify.create({
            message: 'Une erreur est survenue',
            color: 'negative',
            icon: 'report_problem',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          Loading.hide()
        })
    },
    handleUpdatePassword(newPass) {
      // TODO: check old password
      const user = getAuth().currentUser
      updatePassword(user, newPass).then(() => {
        Notify.create({
          message: 'Votre mot de passe a bien été mis à jour',
          color: 'positive',
          icon: 'check_circle',
          timeout: 5000,
          position: 'top',
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
      }).catch((err) => {
        Notify.create({
          message: translate().translateUpdatePasswordError(err),
          color: 'negative',
          icon: 'report_problem',
          timeout: 5000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
      })
    }
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
  &__username {
    line-height: 1;
    margin-bottom: 0;
    &-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.page {
  align-items: start;
  padding-top: 20px;
}
</style>
