<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import GlobalEvents from 'vue-global-events'
import customActions from './plugins/actions'
import { fireAuth } from './firebase_exports'

// Register global events component
Vue.component('GlobalEvents', GlobalEvents)

// Register custom plugins
Vue.use(customActions)

export default {
  data () {
    return {}
  },
  mounted() {
    // Create auth listener to update app on sign in/out
    fireAuth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('setUser', { user })
      } else {
        this.$store.dispatch('logOut')
        if (this.$route.name !== 'login') this.$router.replace('/login')
      }
    })
  },
  methods: {
  }
}
</script>
