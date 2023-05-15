<template>
  <div class="page-container">
    <q-page class="page">
      <div class="page-content" v-if="user.avatar">
        <div class="account__avatar-container q-mb-md">
          <q-img :src="user.avatar.imgUrl" class="account__avatar-img" />
        </div>
        <div class="account__username-container q-mt-md">
          <q-form
            class="flex flex-center row form account-form"
            ref="updateEmailForm"
            v-if="forms.username.show"
            @submit.prevent="
              () => {
                handleUpdateAccount({ username: forms.username.value.trim() }).then(() => {
                  forms.username.show = false
                  forms.username.value = ''
                })
              }
            "
          >
            <q-input
              name="username"
              outlined
              autofocus
              class="account-input"
              type="text"
              v-model="forms.username.value"
              lazy-rules
              :rules="[
                (val) =>
                  val.length > 3 || 'Veullez renseigner minimum 4 caractères'
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
              @click="
                () => {
                  forms.username.show = false
                  forms.username.value = ''
                }
              "
            />
          </q-form>
          <div class="text-h6 text-center account__username-content" v-else>
            <p class="account__username q-mr-xs text-bold">
              {{ user.username }}
            </p>
            <q-icon
              name="edit"
              color="secondary"
              @click="
                () => {
                  forms.username.show = true
                  forms.username.value = user.username
                }
              "
            ></q-icon>
          </div>
        </div>
        <div class="account__details q-mt-xl">
          <div class="account_detail">
            <div class="account_detail__label text-h6 flex items-center">
              <p class="q-mb-0 text-bold q-mr-xs">Date de naissance</p>
              <q-icon
                name="edit"
                color="secondary"
                @click="
                  () => {
                    forms.birthday.show = true
                    forms.birthday.value = format.dateToDisplay(user.birthday)
                  }
                "
              ></q-icon>
            </div>
            <q-form
              class="flex flex-center row form account-form"
              ref="updateBirthdayForm"
              v-if="forms.birthday.show"
              @submit.prevent="
                () => {
                  handleUpdateAccount({
                    birthday: format.dateTimeFormatToBDD(forms.birthday.value)
                  }).then(() => {
                    forms.birthday.show = false
                    forms.birthday.value = ''
                  })
                }
              "
            >
              <q-input
                outlined
                v-model="forms.birthday.value"
                autofocus
                lazy-rules
                :rules="[
                  (val) =>
                    /^-?[0-3]\d\/[0-1]\d\/\d\d\d\d$/.test(val) ||
                    'Veullez renseigner une date valide',
                  (val) => {
                    const date = new Date(val)
                    const min = new Date()
                    min.setFullYear(min.getFullYear() - 16)
                    return (
                      date < min ||
                      'Cette application est réservée aux personnes de plus de 16 ans'
                    )
                  },
                  (val) => {
                    const date = new Date(val)
                    const max = new Date()
                    max.setFullYear(max.getFullYear() - 100)
                    return (
                      date >= max ||
                      'Veuillez renseigner votre vrai date de naissance'
                    )
                  }
                ]"
                class="account-input"
                hide-bottom-space
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="secondary">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="forms.birthday.value"
                        navigation-max-year-month="2023/01"
                        mask="DD/MM/YYYY"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fermer"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
                @click="
                  () => {
                    forms.birthday.show = false
                    forms.birthday.value = ''
                  }
                "
              />
            </q-form>
            <p class="account_detail__value" v-else>
              {{ format.dateToDisplay(user.birthday) }}
            </p>
          </div>
          <div class="account_detail">
            <div class="account_detail__label text-h6 flex items-center">
              <p class="q-mb-0 text-bold q-mr-xs">Adresse email</p>
              <q-icon
                name="edit"
                color="secondary"
                class="cickable"
                @click="
                  () => {
                    forms.email.show = true
                    forms.email.value = user.email
                  }
                "
              ></q-icon>
            </div>
            <q-form
              class="flex flex-center row form account-form"
              ref="updateEmailForm"
              v-if="forms.email.show"
              @submit.prevent="
                () => {
                  handleUpdateAccount({ email: forms.email.value.trim() }).then(() => {
                    forms.email.show = false
                    forms.email.value = ''
                  })
                }
              "
            >
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
                    rules.email(val) ||
                    'Veullez rensigner une addresse email valide'
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
                @click="
                  () => {
                    forms.email.show = false
                    forms.email.value = ''
                  }
                "
              />
            </q-form>
            <p class="account_detail__value" v-else>{{ user.email }}</p>
          </div>
          <div class="account_detail">
            <div class="account_detail__label text-h6 flex items-center">
              <p class="q-mb-0 text-bold q-mr-xs">Mot de passe</p>
              <q-icon name="edit" color="secondary" @click="forms.password.show = true"></q-icon>
            </div>
            <q-form
              class="flex flex-center column form account-form account-password-form"
              ref="updateEmailForm"
              v-if="forms.password.show"
              @submit.prevent="
                () => {
                  handleUpdatePassword(forms.password.current.trim(), forms.password.new.trim()).then(() => {
                    forms.password = {
                      show: false,
                      current: '',
                      new: '',
                      confirm: '',
                      showCurrentPassword: false,
                      showNewPassword: false,
                      showConfirmPassword: false
                    }
                  })
                }
              "
            >
              <q-input
                name="password"
                outlined
                label="Ancien mot de passe"
                class="q-mb-md account-input"
                :type="forms.password.showCurrentPassword ? 'text' : 'password'"
                v-model="forms.password.current"
                lazy-rules
                autofocus
                :rules="[
                  (val) =>
                    val.trim().length > 0 || 'Veullez remplir ce champ'
                ]"
                hide-bottom-space
              >
                <template v-slot:append>
                  <q-icon
                    :name="forms.password.showCurrentPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    color="secondary"
                    @click="forms.password.showCurrentPassword = !forms.password.showCurrentPassword"
                  />
                </template>
              </q-input>
              <q-input
                name="password"
                outlined
                label="Nouveau mot de passe"
                class="q-mb-md account-input"
                :type="forms.password.showNewPassword ? 'text' : 'password'"
                v-model="forms.password.new"
                lazy-rules
                hint="8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial"
                hide-hint
                :rules="[
                  (val) =>
                    val.trim().length > 0 || 'Veullez remplir ce champ',
                  (val) =>
                    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/g.test(
                      val
                    ) ||
                    'Veullez renseigner un mot de passe contetant un caractère spécial, une majuscule, une minuscule et un chiffre, et d\'au moins 8 caractères'
                ]"
                hide-bottom-space
              >
                <template v-slot:append>
                  <q-icon
                    :name="forms.password.showNewPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    color="secondary"
                    @click="forms.password.showNewPassword = !forms.password.showNewPassword"
                  />
                </template>
              </q-input>
              <q-input
                name="confirmPassword"
                outlined
                label="Confirmation du nouveau mot de passe"
                class="q-mb-md account-input"
                :type="forms.password.showConfirmPassword ? 'text' : 'password'"
                v-model="forms.password.confirm"
                lazy-rules
                :rules="[
                  (val) =>
                    val.trim().length > 0 || 'Veullez remplir ce champ',
                  (val) =>
                    val === forms.password.new ||
                    'Veuillez confirmer votre nouveau mot de passe'
                ]"
                hide-bottom-space
              >
                <template v-slot:append>
                  <q-icon
                    :name="
                      forms.password.showConfirmPassword ? 'visibility' : 'visibility_off'
                    "
                    class="cursor-pointer"
                    color="secondary"
                    @click="forms.password.showConfirmPassword = !forms.password.showConfirmPassword"
                  />
                </template>
              </q-input>
              <div>
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
                  @click="
                    () => {
                      forms.password = {
                        show: false,
                        current: '',
                        new: '',
                        confirm: '',
                        showCurrentPassword: false,
                        showNewPassword: false,
                        showConfirmPassword: false
                      }
                    }
                  "
                />
              </div>
            </q-form>
            <p class="account_detail__value" v-else>************</p>
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
            @update:model-value="
              handleUpdateAccount({ private: user.private.trim() })
            "
          />
          <q-toggle
            v-model="user.newsletter"
            label="Recevoir la newsletter"
            color="primary"
            class="q-mb-md"
            @update:model-value="
              handleUpdateAccount({ newsletter: user.newsletter.trim() })
            "
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
import { Loading, Notify } from 'quasar'
import createFormat from '../stores/formatting.js'
import {
  // getAvatar,
  getUser,
  logout,
  updateUser,
  deleteUserData,
auth
} from 'src/boot/firebase'
import translate from '../stores/translatting.js'
import {
  // AuthCredential,
  getAuth,
  signInWithEmailAndPassword,
  // reauthenticateWithCredential,
  // signInWithCustomToken,
  updateEmail,
  updatePassword
} from 'firebase/auth'
import { getAvatar } from 'src/boot/firebase'

export default {
  name: 'AccountPage',
  data() {
    return {
      user: {},
      format: createFormat(),
      logoutLoading: false,
      deleteLoading: false,
      forms: {
        username: {
          show: false,
          value: ''
        },
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
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false
        }
      }
    }
  },
  created() {
    this.reloadData()
    console.log(auth.currentUser)
  },
  methods: {
    async reloadData() {
      Loading.show()
      // await signInWithCustomToken(getAuth(), LocalStorage.getItem('token')).catch((err) => {
      //   Loading.hide()
      //   this.$router.push({ name: 'welcome' })
      //   LocalStorage.remove('token')
      //   LocalStorage.remove('user')
      //   Notify.create({
      //     message: 'Veuillez vous reconnecter',
      //     color: 'negative',
      //     icon: 'report_problem',
      //     timeout: 5000,
      //     actions: [
      //       {
      //         icon: 'close',
      //         color: 'white'
      //       }
      //     ]
      //   })
      //   throw new Error(err)
      // })
      await getUser(auth.currentUser.uid)
        .then((user) => {
          // LocalStorage.set('user', user)
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
          this.$router.push({ name: 'home' })
          throw new Error('Une erreur est survenue')
        })
      getAvatar(this.user.avatar.id)
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
          this.$router.push({ name: 'home' })
        })
    },
    handleLogout() {
      this.logoutLoading = true
      logout()
        .then(() => {
          this.$router.push({ name: 'welcome' })
          Notify.create({
            message: 'Vous avez bien été déconnecté',
            color: 'positive',
            icon: 'check_circle',
            timeout: 5000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
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
      await deleteUserData().then(() => {
        this.$router.push({ name: 'welcome' })
        Notify.create({
          message: 'Votre compte a bien été supprimé',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 5000,
          actions: [
            {
              icon: 'close',
              color: 'white'
            }
          ]
        })
      }).catch((err) => {
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
        throw new Error('Une erreur est survenue')
      })
      logout()
        .then(() => {
          this.$router.push({ name: 'welcome' })
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
      if (payload.email) {
        await updateEmail(getAuth().currentUser, payload.email).catch((err) => {
          Loading.hide()
          Notify.create({
            message: translate().translateUpdateUserEmailError(err),
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
          throw new Error('Une erreur est survenue')
        })
      }
      await updateUser(this.user.uid, payload).catch((err) => {
        Loading.hide()
        Notify.create({
          message: translate().translateUpdateUserError(err),
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
        throw new Error('Une erreur est survenue')
      })
      getUser(auth.currentUser.uid)
        .then((user) => {
          // LocalStorage.set('user', user)
          this.user = {
            ...user,
            avatar: this.user.avatar
          }
          Loading.hide()
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
        .catch((err) => {
          Notify.create({
            message: translate().translateGetUserError(err),
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
    async handleUpdatePassword(oldPass, newPass) {
      Loading.show()
      const user = auth.currentUser
      await signInWithEmailAndPassword(auth, user.email, oldPass).catch((err) => {
        Loading.hide()
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
        throw new Error(err)
      })
      await auth.currentUser.reload()
      updatePassword(user, newPass)
        .then(() => {
          Loading.hide()
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
        })
        .catch((err) => {
          Loading.hide()
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
    &-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.page {
  padding-top: 20px;
}
</style>
