<template>
<div>
  <div class="time">
    <div class="time-div" :class="[open ? 'slide-in-right' : 'slide-out-right', hidden ? 'hidden' : '']">
      <div class="tabs">
        <div @click="switchTab('reminders')" :class="tab.reminders ? 'active' : ''"><i class="fas fa-bell"></i></div>
        <div @click="switchTab('timer')" :class="tab.timer ? 'active' : ''"><i class="fas fa-hourglass"></i></div>
        <div @click="switchTab('stopwatch')" :class="tab.stopwatch ? 'active' : ''"><i class="fas fa-stopwatch"></i></div>
      </div>
      <div :class="['time-content', tab.reminders ? '' : 'hidden']">
        <h3><span class="title-prefix">PRGM?\\_</span>REMINDERS</h3>
        Set reminders - coming soon
      </div>
      <div :class="['time-content', tab.timer ? '' : 'hidden']">
        <h3><span class="title-prefix">PRGM?\\_</span>TIMER</h3>
        Set timer - coming soon
      </div>
      <div :class="['time-content', tab.stopwatch ? '' : 'hidden']">
        <h3><span class="title-prefix">PRGM?\\_</span>STOPWATCH</h3>
        Stopwatch - coming soon
      </div>
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

  .time-div {
    position: fixed;
    bottom: 50px;
    right: 10px;
    width: 20%;
    height: 40%;
    border-radius: 15px;
    text-align: center;
    font-family: 'Orbitron', sans-serif;
    font-weight: 400;
    font-size: 1.5em;
    border: 3px solid black;
    background: rgba(36, 36, 36, 0.65);
    opacity: 60%;
  }

  .time-content {
    cursor: default;
    user-select: none;
  }
  .time-content.hidden {
    display: none;
  }

  .title-prefix {
    color: rgba(31, 23, 23, 0.68);
  }
  .tabs {
    display: flex;
  }
  .tabs > div {
    cursor: pointer;
    width: 100%;
    padding: 10px;
    border-bottom: 2px solid #0c0c0c;
  }
  .tabs > div:hover {
    opacity: 40%;
  }
  .tabs > div.active {
    background: #1f1f1f;
  }
  .tabs > div:not(:last-child) {
    border-right: 1px solid black;
  }
</style>
