<template>
  <div class="bar">
    <div v-if="title" class="title">\\ {{ title }}</div>
    <div v-else class="title">\\ SILICON: DASHBOARD</div>
    <template v-if="$route.name === 'login'">
      <div class="function-button" @click="$emit('submitbtn')"><span class="key">⏎</span> SUBMIT</div>
      <div class="function-button" @click="$emit('resetpwdbtn')">RESET PASSWORD</div>
      <div class="function-button" @click="$emit('restartbtn')"><span class="key">ESC</span> RESTART</div>
    </template>
    <template v-else-if="$store.state.loggedIn">
      <GlobalEvents
          @keyup.shift.l="() => {$playSound('whir_1'); $store.dispatch('logOut')}"
          @keypress.shift.s="$navigate('settings')"
          @keyup.esc="$navigate('')"
      />
      <div class="function-button" v-if="$route.name !== 'index'" @click="$navigate('')"><span class="key">ESC</span> HOME</div>
      <div class="function-button">
        <div class="function-dropdown-button">
          <span class="key">N</span>EW
          <div class="function-dropdown">
<!--            <div>hello</div>-->
<!--            <div>there</div>-->
          </div>
        </div>
      </div>
      <div class="function-button"><span class="key">O</span>PEN PROJECT</div>
      <div class="function-button" @click="$navigate('settings')"><span class="key">↑S</span>ETTINGS</div>
      <div class="function-button" @click="$store.dispatch('logOut')"><span class="key">↑L</span>OG OUT</div>
    </template>
    <template v-else>
      <div class="function-button">\\ VERIFYING //</div>
    </template>
    <div class="user">
      <span :class="[$store.state.loggedIn ? 'green' : 'red']">{{ $store.state.loggedIn ? 'CURRENT_USER:' : 'USER_LOGGED_OUT' }}</span>
      <span class="username" v-if="$store.state.loggedIn">{{ $store.state.userData ? $store.state.userData.name : 'Anonymous' }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TopBar',
  components: {
  },
  data () {
    return {
    }
  },
  props: {
    title: String
  },
  methods: {
  }
}
</script>

<style scoped>
  .bar {
    /*position: absolute;*/
    display: flex;
    margin: 0;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    border-bottom: 1px solid black;
    cursor: default;
    user-select: none;
    background: rgba(0, 0, 45, 0.1);
  }
  .bar > div {
    width: 100%;
  }
  .title {
    font-family: 'Audiowide', cursive;
    font-size: 1.6em;
  }
  .user {
    font-family: 'Raleway', sans-serif;
    font-size: 1.4em;
    font-weight: 400;
    text-align: right;
  }
  .username {
    font-family: 'Raleway', sans-serif;
    font-size: 0.9em;
    font-weight: 600;
    text-transform: uppercase;
  }
  .function-dropdown-button {

  }
  .function-dropdown {
    position: fixed;
    display: flex;
    flex-direction: column;
  }
  .function-dropdown div {
    height: 30px;
    width: 200px;
    margin: 0 auto;
  }
</style>