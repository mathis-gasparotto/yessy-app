<template>
  <div class="add-bet-category__cards page-content">
    <q-form
      class="add-bet-form__form flex flex-center column form"
      ref="addBetForm"
    >
      <q-input
        name="label"
        rounded
        outlined
        label="Intitulé du pari"
        autofocus
        class="q-mb-md global-input"
        type="text"
        v-model="form.label"
        lazy-rules
        :rules="[
          (val) => val.length > 5 || 'Veullez renseigner plus de 5 caractères'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="edit"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
      </q-input>
      <q-input
        name="description"
        rounded
        outlined
        label="Description"
        class="q-mb-md global-textarea"
        type="textarea"
        v-model="form.description"
        lazy-rules
        :rules="[
          (val) => val.length > 0 || 'Veullez renseigner une description'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="info"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
      </q-input>
      <q-select
        rounded
        outlined
        name="reward"
        v-model="form.reward"
        :options="rewards"
        label="Récompense"
        class="q-mb-md global-select"
        lazy-rules
        :rules="[
          (val) => typeof val === 'object' || 'Veullez renseigner un type de récompense'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="fa fa-gift"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
      </q-select>
      <q-input
        v-if="form.reward.value === 'tokens'"
        name="tokenRewardOdd"
        rounded
        outlined
        label="Cote"
        class="q-mb-md global-input"
        type="number"
        v-model="form.tokenRewardOdd"
        lazy-rules
        :rules="[
          (val) => (form.reward.value === 'other' || val > 1) || 'Veullez renseigner une cote supérieure à 1'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="fa fa-coins"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
      </q-input>
      <q-input
        v-if="form.reward.value === 'other'"
        name="customReward"
        rounded
        outlined
        label="Récompense personnalisée"
        class="q-mb-md global-input"
        type="text"
        v-model="form.customReward"
        lazy-rules
        :rules="[
          (val) => (form.reward.value === 'tokens' || val.length > 0) || 'Veullez renseigner une récompense personnalisée'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="edit"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
      </q-input>
      <q-input
        v-if="form.reward === rewards[1]"
        name="customCost"
        rounded
        outlined
        label="Mise en jeu"
        class="q-mb-md global-input"
        type="text"
        v-model="form.customCost"
        lazy-rules
        :rules="[
          (val) => (form.reward === rewards[0] || val.length > 0) || 'Veullez renseigner une mise en jeu'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="fa fa-hand-holding-dollar"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
      </q-input>
      <q-input
        rounded
        outlined
        v-model="form.startAt"
        lazy-rules
        :rules="[
          (val) =>
            (/^-?\d\d\d\d\/[0-1]\d\/[0-3]\d\s\d\d:[0-5][0-9]$/.test(val) || val.length === 0) ||
            'Veullez renseigner une date valide',
          (val) => {
            const date = new Date(val)
            const now = new Date()
            return (
              (now < date || val.length === 0) || 'Veuillez renseigner une date supérieure à maintenant'
            )
          }
        ]"
        label="Date de début (instantané si null)"
        class="q-mb-md global-input"
        hide-bottom-space
        mask="datetime"
      >
        <template v-slot:prepend>
          <q-icon
            name="calendar_month"
            color="secondary"
            size="xs"
          ></q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
            color="secondary"
            size="sm"
            @click.prevent="showCalendarStartAt = true"
          >
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
                @update:model-value="
                  (value, reason, details) => handleUpdateDate(reason, 'startAt')
                "
                v-if="!showTimeStartAt && showCalendarStartAt"
              >
                <div class="row items-center justify-end">
                  <q-btn
                    label="Choisir l'horaire"
                    color="primary"
                    flat
                    @click.prevent="showTimeStartAt = true"
                  />
                </div>
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
                  <q-btn
                    label="Retour au choix de la date"
                    color="primary"
                    flat
                    @click.prevent="showTimeStartAt = false"
                  />
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
              now < date || 'Veuillez renseigner une date supérieure à maintenant'
            )
          },
          (val) => {
            const date = new Date(val)
            const min = form.startAt ? new Date(form.startAt) : new Date()
            return (
              (min && min < date) ||
              'Veuillez renseigner une date supérieure à la date de début'
            )
          }
        ]"
        label="Date de fin"
        class="q-mb-md global-input"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon
            name="sports_score"
            color="secondary"
            size="xs"
          >
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
            color="secondary"
            size="sm"
            @click.prevent="showCalendarEndAt = true"
          >
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
                @update:model-value="
                  (value, reason, details) => handleUpdateDate(reason, 'endAt')
                "
                v-if="!showTimeEndAt && showCalendarEndAt"
              >
                <div class="row items-center justify-end">
                  <q-btn
                    label="Choisir l'horaire"
                    color="primary"
                    flat
                    @click.prevent="showTimeStartAt = true"
                  />
                </div>
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
                  <q-btn
                    label="Retour au choix de la date"
                    color="primary"
                    flat
                    @click.prevent="showTimeEndAt = false"
                  />
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
  </div>
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
        endAt: '',
        reward: '',
        tokenRewardOdd: '',
        customReward: '',
        // cost: '',
        customCost: '',
        description: ''
      },
      validate: false,
      showPassword: false,
      loading: false,
      showCalendarStartAt: false,
      showCalendarEndAt: false,
      showTimeStartAt: false,
      showTimeEndAt: false,
      rewards: [
        {
          label: 'Jetons',
          value: 'tokens'
        },
        {
          label: 'Autre',
          value: 'other'
        }
      ],
      // costs: [
      //   {
      //     label: 'Jetons',
      //     value: 'tokens'
      //   },
      //   {
      //     label: 'Autre',
      //     value: 'other'
      //   }
      // ]
    }
  },
  watch: {
    form: {
      handler() {
        this.validateForm()
      },
      deep: true
    }
  },
  methods: {
    handleUpdateDate(reason, valueName) {
      if (reason === 'add-day' && valueName === 'startAt') {
        setTimeout(() => {
          this.showTimeStartAt = true
        }, 300)
      }
      if (reason === 'add-day' && valueName === 'endAt') {
        setTimeout(() => {
          this.showTimeEndAt = true
        }, 300)
      }
    },
    onsubmit() {
      this.loading = true
      this.$refs.addBetForm.validate().then((success) => {
        if (success) {
          const payload = {
            label: this.form.label,
            startAt: this.form.startAt,
            endAt: this.form.endAt,
            tokenRewardOdd: this.form.tokenRewardOdd,
            customReward: this.form.customReward,
            customCost: this.form.customCost,
            description: this.form.description
          }
          this.$emit('submitForm', payload)
        } else {
          console.log('error')
          this.loading = false
        }
      })
    },
    validateForm() {
      if (
        this.form.label && this.form.endAt && this.form.reward.value && this.form.description
        && ((this.form.reward.value === 'other' && this.form.customReward && this.form.customCost) || (this.form.reward.value === 'tokens' && this.form.tokenRewardOdd))
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
.page-content {
  padding-top: 0px;
}
</style>
