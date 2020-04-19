<template>
<div>
  <div class="time">
    <div class="time-back"></div>
    <div class="time-div">
      <div class="tabs">
        <div @click="switchTab('alarm')" :class="tab.alarm ? 'active' : ''"><i class="fas fa-bell"></i></div>
        <div @click="switchTab('timer')" :class="tab.timer ? 'active' : ''"><i class="fas fa-hourglass"></i></div>
        <div @click="switchTab('stopwatch')" :class="tab.stopwatch ? 'active' : ''"><i class="fas fa-stopwatch"></i></div>
      </div>
      <div class="time-content" ref="alarm">
        <h3><span class="title-prefix">PRGM?\\_</span>SET_ALARM</h3>
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
      currentTab: 'alarm',
      tab: {
        alarm: true,
        timer: false,
        stopwatch: false
      }
    }
  },
  props: {
    open: Boolean
  },
  methods: {
    switchTab(tab) {
      this.tab[this.currentTab] = false
      this.tab[tab] = true
    }
  }
}
</script>

<style scoped>

  .time > div {
    position: fixed;
    bottom: 50px;
    right: 10px;
    width: 20%;
    height: 40%;
    border-radius: 15px;
  }

  .time-back {
    background: #242424;
    opacity: 60%;
  }

  .time-div {
    text-align: center;
    font-family: 'Orbitron', sans-serif;
    font-weight: 400;
    font-size: 1.5em;
    transform: translateY(3px) translateX(3px);
    border: 3px solid black;
  }
  .time-content {
    cursor: default;
    user-select: none;
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
