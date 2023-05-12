<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
// import authStoreModule from 'stores/auth'

export default {
  setup () {
    const $store = useStore('auth')

    console.log('authStoreModule', $store)

    // onMounted(() => {
    //   // Preserve the previous state if it was injected from the server
    //   $store.registerModule('foo', authStoreModule, { preserveState: true })
    // })

    // onUnmounted(() => {
    //   // IMPORTANT: avoid duplicate module registration on the client
    //   // when the route is visited multiple times.
    //   $store.unregisterModule('foo')
    // })

    // const authStore = computed(() => {
    //   return $store.state.user
    // })

    return {
      // authStore
      $store
    }
  }
}
</script>
