<template>
  <div class="add-bet-category__cards page-content">
    <q-form class="add-bet-form__form flex flex-center column form" ref="addBetForm">
      <q-input
        name="label"
        rounded
        outlined
        label="Intitulé du pari"
        autofocus
        class="q-mb-md global-input bg-input-white"
        type="text"
        v-model="form.label"
        lazy-rules
        :rules="[(val) => val.trim().length > 5 || 'Veullez renseigner minimum 6 caractères']"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="edit" color="secondary" size="xs"></q-icon>
        </template>
      </q-input>
      <q-input
        v-for="(choice, index) in form.choices"
        :key="index"
        :name="`choice${index + 1}`"
        rounded
        outlined
        :label="`Choix ${index + 1}`"
        class="q-mb-md global-input bg-input-white"
        type="text"
        v-model="choice.label"
        lazy-rules
        :rules="[(val) => val.trim().length > 2 || 'Veullez renseigner minimum 3 caractères']"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon :name="getChoiceIconName(index)" color="secondary" size="xs"></q-icon>
        </template>
      </q-input>
      <div class="q-mb-md flex flex-center">
        <q-btn label="Ajouter un choix" class="btn btn-secondary" rounded @click.prevent="addChoice()" />
        <q-btn
          v-if="form.choices.length > 2"
          label="Supprimer un choix"
          class="btn btn-primary"
          rounded
          @click.prevent="deleteChoice()"
        />
      </div>
      <q-input
        name="description"
        rounded
        outlined
        label="Description"
        class="q-mb-md global-textarea bg-input-white"
        type="textarea"
        v-model="form.description"
        lazy-rules
        :rules="[(val) => val.trim().length > 0 || 'Veullez renseigner une description']"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="info" color="secondary" size="xs"></q-icon>
        </template>
      </q-input>
      <q-select
        rounded
        outlined
        name="reward"
        v-model="form.reward"
        :options="rewards"
        label="Récompense"
        class="q-mb-md global-select bg-input-white"
        lazy-rules
        :rules="[(val) => typeof val === 'object' || 'Veullez renseigner un type de récompense']"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="fa fa-gift" color="secondary" size="xs"></q-icon>
        </template>
      </q-select>
      <q-input
        v-if="form.reward === rewards[1]"
        name="customCost"
        rounded
        outlined
        label="Mise en jeu"
        class="q-mb-md global-input bg-input-white"
        type="text"
        v-model="form.customCost"
        lazy-rules
        :rules="[(val) => form.reward === rewards[0] || val.trim().length > 0 || 'Veullez renseigner une mise en jeu']"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="fa fa-hand-holding-dollar" color="secondary" size="xs"></q-icon>
        </template>
      </q-input>
      <q-input
        v-if="form.reward.value === 'other'"
        name="customReward"
        rounded
        outlined
        label="Récompense personnalisée"
        class="q-mb-md global-input bg-input-white"
        type="text"
        v-model="form.customReward"
        lazy-rules
        :rules="[
          (val) =>
            form.reward.value === 'tokens' || val.trim().length > 0 || 'Veullez renseigner une récompense personnalisée'
        ]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="edit" color="secondary" size="xs"></q-icon>
        </template>
      </q-input>
      <q-input
        rounded
        outlined
        v-model="form.startAt"
        lazy-rules
        :rules="[
          (val) =>
            /^-?\d\d\d\d\/[0-1]\d\/[0-3]\d\s\d\d:[0-5][0-9]$/.test(val) ||
            val.length === 0 ||
            'Veullez renseigner une date valide',
          (val) => {
            const date = new Date(val)
            const now = new Date()
            return now < date || val.length === 0 || 'Veuillez renseigner une date supérieure à maintenant'
          }
        ]"
        label="Date de début"
        class="q-mb-md global-input q-mb-0 bg-input-white"
        hide-bottom-space
        mask="datetime"
      >
        <template v-slot:prepend>
          <q-icon name="calendar_month" color="secondary" size="xs"></q-icon>
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
                @update:model-value="(value, reason, details) => handleUpdateDate(reason, 'startAt')"
                v-if="!showTimeStartAt && showCalendarStartAt"
              >
                <div class="row items-center justify-end">
                  <q-btn label="Choisir l'horaire" color="primary" flat @click.prevent="showTimeStartAt = true" />
                </div>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fermer" color="primary" flat />
                </div>
              </q-date>
              <q-time color="primary" v-model="form.startAt" mask="YYYY/MM/DD HH:mm" v-else>
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
      <p class="text-small">Laissez vide pour un début immédiat 🚀</p>
      <q-input
        rounded
        outlined
        v-model="form.endAt"
        mask="datetime"
        lazy-rules
        :rules="[
          (val) => /^-?\d\d\d\d\/[0-1]\d\/[0-3]\d\s\d\d:[0-5][0-9]$/.test(val) || 'Veullez renseigner une date valide',
          (val) => {
            const date = new Date(val)
            const now = new Date()
            return now < date || 'Veuillez renseigner une date supérieure à maintenant'
          },
          (val) => {
            const date = new Date(val)
            const min = form.startAt ? new Date(form.startAt) : new Date()
            return (min && min < date) || 'Veuillez renseigner une date supérieure à la date de début'
          }
        ]"
        label="Date de fin"
        class="q-mb-md global-input bg-input-white"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="sports_score" color="secondary" size="xs"> </q-icon>
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
                @update:model-value="(value, reason, details) => handleUpdateDate(reason, 'endAt')"
                v-if="!showTimeEndAt && showCalendarEndAt"
              >
                <div class="row items-center justify-end">
                  <q-btn label="Choisir l'horaire" color="primary" flat @click.prevent="showTimeStartAt = true" />
                </div>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fermer" color="primary" flat />
                </div>
              </q-date>
              <q-time color="primary" v-model="form.endAt" mask="YYYY/MM/DD HH:mm" v-else>
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
// import createFormat from '../../stores/formatting'

export default {
  name: 'AddBetForm',
  data() {
    return {
      form: {
        label: '',
        startAt: '',
        endAt: '',
        reward: '',
        customReward: '',
        // cost: '',
        customCost: '',
        description: '',
        choices: [
          {
            label: ''
          },
          {
            label: ''
          }
        ]
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
      ]
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
    getChoiceIconName(index) {
      switch (index) {
        case 0:
          return 'fa fa-dice-one'
        case 1:
          return 'fa fa-dice-two'
        case 2:
          return 'fa fa-dice-three'
        case 3:
          return 'fa fa-dice-four'
        case 4:
          return 'fa fa-dice-five'
        case 5:
          return 'fa fa-dice-six'
        default:
          return 'fa fa-dice-six'
      }
    },
    addChoice() {
      this.form.choices.push({
        label: ''
      })
    },
    deleteChoice() {
      this.form.choices.pop()
    },
    handleUpdateDate(reason, valueName) {
      if (reason === 'add-day' && valueName === 'startAt') {
        // To have a little delay before switching to time
        setTimeout(() => {
          this.showTimeStartAt = true
        }, 300)
      }
      if (reason === 'add-day' && valueName === 'endAt') {
        // To have a little delay before switching to time
        setTimeout(() => {
          this.showTimeEndAt = true
        }, 300)
      }
    },
    onsubmit() {
      this.loading = true
      this.form.choices.forEach((choice) => {
        choice.label = choice.label.trim()
      })
      this.$refs.addBetForm.validate().then((success) => {
        if (success) {
          let payload = {
            label: this.form.label.trim(),
            startAt: this.form.startAt,
            endAt: this.form.endAt,
            description: this.form.description.trim()
          }
          if (this.form.customReward.trim().length > 0 && this.form.customCost.trim().length > 0) {
            payload = {
              ...payload,
              customReward: this.form.customReward.trim(),
              customCost: this.form.customCost.trim()
            }
          }
          this.$emit('submitForm', payload, this.form.choices)
          setTimeout(() => {
            this.loading = false
          }, 3000)
        } else {
          console.log('error')
          this.loading = false
        }
      })
    },
    validateForm() {
      // Check if choices are not empty
      let choicesNoEmpty = true
      this.form.choices.forEach((choice) => {
        if (choicesNoEmpty) {
          choicesNoEmpty = choice.label.trim() !== ''
        }
      })

      if (
        choicesNoEmpty &&
        this.form.label.trim() !== '' &&
        this.form.endAt.trim() !== '' &&
        this.form.reward.value &&
        this.form.description.trim() !== '' &&
        ((this.form.reward.value === 'other' && this.form.customReward.trim() !== '' && this.form.customCost.trim() !== '') ||
          this.form.reward.value === 'tokens')
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
