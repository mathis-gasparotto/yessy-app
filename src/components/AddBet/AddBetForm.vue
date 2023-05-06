<template>
  <q-form class="add-bet-form__form flex flex-center column form" ref="addBetForm">
    <q-input
      name="label"
      rounded
      outlined
      label="Intitulé du pari*"
      autofocus
      class="q-mb-md global-input"
      type="text"
      v-model="form.label"
      lazy-rules
      :rules="[
        (val) =>
          val.length > 3 || 'Veullez renseigner au minimum 3 caractères'
      ]"
      hide-bottom-space
    ></q-input>
    <q-input
      rounded
      outlined
      v-model="form.startAt"
      lazy-rules
      :rules="[
        (val) =>
          /^-?\d\d\d\d\/[0-1]\d\/[0-3]\d\s\d\d:[0-5][0-9]$/.test(val) ||
          'Veullez renseigner une date valide',
        (val) => {
          const date = new Date(val)
          const now = new Date()
          return (
            now < date ||
            'Veuillez renseigner une date supérieure à maintenant'
          )
        }
      ]"
      label="Date de début (instantané si null)"
      class="q-mb-md global-input"
      hide-bottom-space
      mask="datetime"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer" @click.prevent="showCalendarStartAt = true">
          <q-dialog
            cover
            transition-show="scale"
            transition-hide="scale"
            v-model="showCalendarStartAt"
            @hide="showTimeStartAt = false"
          >
            <q-date
              v-model="form.startAt"
              navigation-min-year-month="2023/01"
              mask="YYYY/MM/DD HH:mm"
              @update:model-value="(value, reason, details) => handleUpdateDate(reason, 'startAt')"
              v-if="!showTimeStartAt && showCalendarStartAt"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-date>
            <q-time
              color="primary"
              v-model="form.startAt"
              mask="YYYY/MM/DD HH:mm"
              v-else
            >
              <div class="row items-center justify-end">
                <q-btn label="Retour au choix de la date" color="primary" flat @click.prevent="showTimeStartAt = false" />
              </div>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-time>
          </q-dialog>
        </q-icon>
      </template>
    </q-input>
    <q-input
      rounded
      outlined
      v-model="form.endAt"
      mask="datetime"
      lazy-rules
      :rules="[
        (val) =>
          /^-?\d\d\d\d\/[0-1]\d\/[0-3]\d\s\d\d:[0-5][0-9]$/.test(val) ||
          'Veullez renseigner une date valide',
        (val) => {
          const date = new Date(val)
          const now = new Date()
          return (
            now < date ||
            'Veuillez renseigner une date supérieure à maintenant'
          )
        },
        (val) => {
          const date = new Date(val)
          const min = new Date(form.startAt)
          return (
            (min && min < date) ||
            'Veuillez renseigner une date supérieure à la date de début'
          )
        }
      ]"
      label="Date de fin*"
      class="q-mb-md global-input"
      hide-bottom-space
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer" @click.prevent="showCalendarEndAt = true">
          <q-dialog
            cover
            transition-show="scale"
            transition-hide="scale"
            v-model="showCalendarEndAt"
            @hide="showTimeEndAt = false"
          >
            <q-date
              v-model="form.endAt"
              navigation-min-year-month="2023/01"
              mask="YYYY/MM/DD HH:mm"
              @update:model-value="(value, reason, details) => handleUpdateDate(reason, 'endAt')"
              v-if="!showTimeEndAt && showCalendarEndAt"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-date>
            <q-time
              color="primary"
              v-model="form.endAt"
              mask="YYYY/MM/DD HH:mm"
              v-else
            >
              <div class="row items-center justify-end">
                <q-btn label="Retour au choix de la date" color="primary" flat @click.prevent="showTimeEndAt = false" />
              </div>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-time>
          </q-dialog>
        </q-icon>
      </template>
    </q-input>

    <q-btn
      label="Valider le pari"
      type="submit"
      :class="`form-btn btn btn-${validate ? 'secondary' : 'disabled'}`"
      :disable="!validate"
      rounded
      @click.prevent="onsubmit()"
      :loading="loading"
      padding="sm 50px"
      size="20px"
    />
  </q-form>
</template>

<script>
// import createFormat from '../../stores/formatting.js'

export default {
  name: 'AddBetForm',
  data() {
    return {
      form: {
        label: '',
        startAt: '',
        endAt: ''
      },
      validate: false,
      showPassword: false,
      loading: false,
      showCalendarStartAt: false,
      showCalendarEndAt: false,
      showTimeStartAt: false,
      showTimeEndAt: false
    }
  },
  watch: {
    form: {
      handler() {
        if (
          this.form.label &&
          this.form.startAt &&
          this.form.endAt
        ) {
          this.$refs.addBetForm.validate().then((success) => {
            if (success) {
              this.validate = true
            } else {
              this.validate = false
            }
          })
        } else {
          this.validate = false
        }
      },
      deep: true
    }
  },
  methods: {
    handleUpdateDate (reason, valueName) {
      if (reason === 'add-day' && valueName === 'startAt') {
        setTimeout(() => {
          this.showTimeStartAt = true
        }, 500)
      }
      if (reason === 'add-day' && valueName === 'endAt') {
        setTimeout(() => {
          this.showTimeEndAt = true
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-bet {
  &-form {
    //
  }
}
</style>
