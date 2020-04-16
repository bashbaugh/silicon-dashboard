<template>
  <div class="bar">
    <div class="title">\\ SILICON: DASHBOARD</div>
    <template v-if="loggedIn">
      <div class="function-button"><span class="key">O</span>PEN PROJECT</div>
      <div class="function-button"><span class="key">S</span>ETTINGS</div>
      <div class="function-button" v-if="loggedIn"><span class="key">L</span>OG OUT</div>
    </template>
    <template v-else>
      <div class="function-button">\\ AUTHORIZATION //</div>
    </template>
    <div class="user"><span :class="[loggedIn ? 'green' : 'red']">{{ loggedIn ? 'CURRENT_USER' : 'USER_LOGGED_OUT' }}</span> <span class="username" v-if="loggedIn">User</span></div>
  </div>
</template>

<script>
  export default {
    name: 'TopBar',
    data () {
      return {
        loggedIn: null
      }
    }
  }
</script>

<style>
  .bar {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px;
    border-bottom: 1px solid black;
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
  .function-button {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.3em;
    font-weight: 400;
    text-align: center;
  }
  .function-button .key {
    color: #b3b3b3;
    font-size: 1.1em;
    padding: 0px 2px;
    margin: 0px 2px;
    background: #1f1f1f;
    border-radius: 3px;
  }
  /*.function-button .key::after {*/
  /*  content: "]";*/
  /*  font-weight: 400;*/
  /*  margin: 1px;*/
  /*}*/
  /*.function-button .key::before {*/
  /*  content: "[";*/
  /*  font-weight: 400;*/
  /*  margin: 1px;*/
  /*}*/
</style>