<template>
  <div class='root-div' :data-theme='$store.state.settings.theme'>
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import GlobalEvents from 'vue-global-events'
import customActions from './plugins/actions'

const { fireAuth } = chrome.extension.getBackgroundPage().firebase

// Register global events component
Vue.component('GlobalEvents', GlobalEvents)

// Register custom plugins
Vue.use(customActions)

export default {
  data () {
    return {

    }
  },
  mounted() {
    if (window.location.hash === '#/updated') return // Ignore auth on install/update page

    // Create auth listener to update app on sign in/out
    fireAuth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('setUser', { user })
        setTimeout(() => {
          this.$playSound('beep_1')
        }, 500)
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
