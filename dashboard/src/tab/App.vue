<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import GlobalEvents from 'vue-global-events'
import { fireAuth } from './firebase_exports'

// Register global events component
Vue.component('GlobalEvents', GlobalEvents)

export default {
  data () {
    return {}
  },
  mounted() {

    fireAuth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('setUser', { user })
      } else {
        this.$store.dispatch('logOut')
        if (this.$route.name !== 'login') this.$router.replace('/login')
      }
    })
  }
}
</script>
