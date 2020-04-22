<template>
<div>
    <div class="widget" :class="[open ? 'slide-in-right' : 'slide-out-right', hidden ? 'hidden' : '']">
      <div class="tabs">
        <div @click="switchTab('reminders')" :class="tab.reminders ? 'active' : ''"><i class="fas fa-bell"></i></div>
        <div @click="switchTab('timer')" :class="tab.timer ? 'active' : ''"><i class="fas fa-hourglass"></i></div>
        <div @click="switchTab('stopwatch')" :class="tab.stopwatch ? 'active' : ''"><i class="fas fa-stopwatch"></i></div>
        <div @click="$emit('closeWidget')"><i class="fas fa-times"></i></div>
      </div>
      <div v-if="tab.reminders">
        <h3><span class="title-prefix">PRGM?\\_</span>REMINDERS</h3>
        Set reminders - coming soon
      </div>
      <div v-if="tab.timer">
        <h3><span class="title-prefix">PRGM?\\_</span>TIMER</h3>
        Set timer - coming soon
      </div>
      <div v-if="tab.stopwatch">
        <h3><span class="title-prefix">PRGM?\\_</span>STOPWATCH</h3>
        Stopwatch - coming soon
      </div>
    </div>
</div>
</template>

<script>


export default {
  name: 'Time',
  components: {
  },
  mounted() {
  },
  data () {
    return {
      hidden: true,
      currentTab: 'timer',
      tab: {
        reminders: false,
        timer: true,
        stopwatch: false
      }
    }
  },
  props: {
    open: Boolean
  },
  watch: {
    open(newVal, oldVal) {
      // Once user opens the time modal, remove hidden
      if (newVal === true) {
        this.hidden = false
      }
    }
  },
  methods: {
    switchTab(tab) {
      this.tab[this.currentTab] = false
      this.tab[tab] = true
      this.currentTab = tab
    }
  }
}
</script>

<style scoped>

  .widget {
    bottom: 50px;
    right: 10px;
    width: 20%;
    height: 40%;
  }
</style>
