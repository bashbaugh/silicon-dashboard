<template>
  <div>
    <button @click="openDashboard">Open Dashboard</button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    openDashboard () {
      chrome.tabs.create({})
    }
  }
}
</script>

<style>
  button {

  }
</style>
