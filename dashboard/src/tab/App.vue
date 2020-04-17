<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { fireAuth } from './firebase_exports'

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
