<template>
  <div class="page">
    <TopBar />
    <div class="center">
      <div class="clock">
        {{ time.time }}<span class="clock-subscript">{{ time.suffix }}</span>
      </div>
<!--      <div class="search large-input-container">-->
<!--        <input v-model="search.value" class="large" @keypress="search" maxlength="140" :disabled="search.disabled">-->
<!--      </div>-->
    </div>
    <div class="dashboard-buttons">
      <GlobalEvents @keypress.s="search" @keypress.t="todo" @keypress.l="links"/>
      <div class="function-button" @click="search"><span class="key">S</span>EARCH</div>
      <div class="function-button" @click="search"><span class="key">L</span>INKS</div>
      <div class="function-button" @click="todo"><span class="key">T</span>ODO</div>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/top'

export default {
  name: 'App',
  components: {
    TopBar
  },
  mounted() {
    if (this.$store.state.loggedIn) this.$playSound('beep_1')
    setInterval(this.updateDashboard, 100)
  },
  data () {
    return {
      time: {
        percentage: 73,
        time: '----',
        suffix: '--'
      }
    }
  },
  methods: {
    updateDashboard() {
      const date = new Date()
      this.time.time = `${(date.getHours() + 11) % 12 + 1}:${((date.getMinutes() < 10) ? '0' : '' ) + date.getMinutes()}` // converted to 12-hour time
      this.time.suffix = (date.getHours() / 12) ? 'pm' : 'am'
    },
    search() {
    },
    todo() {

    },
    links() {

    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
}
.clock {
  font-family: 'Aldrich', sans-serif;
  font-size: 10em;
}
.clock-subscript {
  font-size: 0.3em;
}
.center {
  cursor: default;
  user-select: none;
}
.dashboard-buttons {
  display: flex;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: 15px auto;
  width: 100%;
  user-select: none;
}
.dashboard-buttons div {
  width: 100%;
}
</style>
