<template>
  <div class="page-container bg-primary bg-primary--image join-bet">
    <q-page class="page scroll">
      <div class="page-content flex items-center justify-between column" v-if="bet">

      </div>
    </q-page>
  </div>
</template>

<script>
import { Loading, Notify } from 'quasar'
import { useRoute } from 'vue-router'
import createFormat from '../../stores/formatting.js'
import translate from '../../stores/translatting.js'
import { getParticipationCount, iParticipate, participate } from 'src/services/participationService'
import { getBet } from 'src/services/betService'
import { auth } from 'src/boot/firebase'

export default {
  setup() {
    const route = useRoute()

    return {
      route
    }
  },
  name: 'JoinBetPage',
  data() {
    return {
      bet: null,
      joinLoading: false,
      deleteLoading: false,
      createFormat: createFormat(),
      defaultAvatarUrl: process.env.DEFAULT_AVATAR_URL
    }
  },
  created() {
    Loading.show()
    this.reloadData()
  },
  computed: {
    isAuthor() {
      return this.bet && this.bet.author.uid === auth.currentUser.uid
    }
  },
  methods: {
    joinBet() {
      this.joinLoading = true
      participate(this.route.params.id)
        .then(() => {
          this.joinLoading = false
          Notify.create({
            message: 'Vous avez rejoint le pari',
            color: 'positive',
            icon: 'check_circle',
            timeout: 3000,
            position: 'top',
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
          this.reloadData()
        })
        .catch((err) => {
          this.joinLoading = false
          Notify.create({
            message: translate().translateAddParticipationError(err),
            color: 'negative',
            icon: 'report_problem',
            timeout: 3000,
            actions: [
              {
                icon: 'close',
                color: 'white'
              }
            ]
          })
        })
    },
    reloadData() {
      iParticipate(this.route.params.id).then((res) => {
        this.iParticipate = res
      })
      getBet(this.route.params.id)
        .then((res) => {
          this.bet = res
          getParticipationCount(this.route.params.id).then((res) => {
            this.bet.participants = res
          })
          Loading.hide()
        })
        .catch(() => {
          Loading.hide()
          this.$router.push({ name: 'public-bets' })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.join-bet {
  .page {
    background-color: rgba($color: #000, $alpha: .3);
  }
}
</style>
