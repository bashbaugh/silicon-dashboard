<template>
  <div>
    <TopBar title="SILICON: SETTINGS"/>
    <div class="content">
      <h2 class="title">SETTINGS</h2>
      <h4 class="status">{{ status }}</h4>
      <div class="option-container">
        <h3 class="option-title">SOUND EFFECTS</h3>
        <p :class="$store.state.settings.sound ? 'green' : 'red'" @click="() => updateSettings({ sound: !$store.state.settings.sound })">
          { SOUND: OPTIONS.{{ $store.state.settings.sound ? 'SOUND_ENABLED' : 'SOUND_DISABLED' }} }
        </p>
      </div>
      <div class="option-container">
        <h3 class="option-title">MINIMAL MODE</h3>
        <h4>Enabling minimal mode will disable all unnecessary UI elements, such as stats and extra effects</h4>
        <p :class="$store.state.settings.minimal ? 'green' : 'red'" @click="() => updateSettings({ minimal: !$store.state.settings.minimal })">
          { MINIMAL_MODE: {{ $store.state.settings.minimal ? 'ACTIVE' : 'DISABLED' }} }
        </p>
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
  methods: {
    updateSettings(setting) {
      this.$playSound('clink_1')
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
    cursor: pointer;
    user-select: none;
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 1.2em;
  }
</style>
