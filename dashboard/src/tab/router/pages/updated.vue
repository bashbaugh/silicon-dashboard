<template>
  <div>
    <div class="center" v-if="pageReason === 'update'">
      <div class="large-input-prompt">THE NEWEST VERSION OF SILICON DASHBOARD HAS BEEN INSTALLED</div>
      <p class="large-input-status"><a :href="changelog">CLICK HERE</a> TO VIEW THE CHANGE LOG</p>
    </div>
    <div class="center" v-if="pageReason === 'install'">
      <div class="large-input-prompt">SILICON DASHBOARD HAS BEEN INSTALLED</div>
      <p class="large-input-status">OPEN A NEW TAB TO GET STARTED</p>
    </div>
  </div>
</template>

<script>
import cfg from '../../../appconfig'

export default {
  name: 'Updated',
  components: {
  },
  data() {
    return {
      changelog: cfg.changelog,
      pageReason: null
    }
  },
  mounted() {
    const url = new URL(window.location.href)
    this.pageReason = url.searchParams.get('reason')
  }
}
</script>

<style scoped>

</style>
