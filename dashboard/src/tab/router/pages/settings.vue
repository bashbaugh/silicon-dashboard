<template>
  <div>
    <TopBar title="SILICON: SETTINGS"/>
    <div class="content">
      <h2 class="title">SETTINGS</h2>
      <h4 class="status">{{ status }}</h4>
      <div class="soption-container">
        <h4 class="option-title">SOUND EFFECTS</h4>
        <p class="sound.value ? 'green' : 'red'" @click="() => updateSettings({ sound: !$store.state.settings.sound })">{ SOUND: OPTIONS.{{ sound }} }</p>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/top'

export default {
  name: 'Settings',
  components: {
    TopBar
  },
  mounted() {

  },
  data () {
    return {
      status: 'click on an option to change it'
    }
  },
  computed: {
    sound () {
      return (this.$store.state.settings.sound) ? 'SOUND_ENABLED' : 'SOUND_DISABLED'
    }
  },
  methods: {
    updateSettings(setting) {
      new Audio(`/assets/sounds/clink_1.mp3`).play()
      this.status = 'Saving...'
      this.$store.dispatch('updateProfile', { settings: setting })
      .then(() => {
        this.status = 'Settings saved.'
      })
      .catch((err) => {
        this.status = 'Unable to save settings: ' + err
      })
    }
  }
}
</script>

<style scoped>
  .title {
    font-family: 'Audiowide', cursive;
    font-size: 2.5em;
  }
  .option-title {
    font-family: 'Audiowide', cursive;
    font-size: 1.3em;
  }
  p {
    margin: 0 auto;
    width: 50%;
    padding: 5px;
    background: black;
    color: #2dc12d;
    cursor: pointer;
    user-select: none;
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 1.2em;
  }
</style>
