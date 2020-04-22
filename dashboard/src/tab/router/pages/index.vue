<template>
  <div class="page">
    <TopBar />
    <div class="center">
      <div class="clock">
        {{ clock.time }}<span class="clock-subscript">{{ clock.suffix }}</span>
      </div>
<!--      <div class="search large-input-container">-->
<!--        <input v-model="search.value" class="large" @keypress="search" maxlength="140" :disabled="search.disabled">-->
<!--      </div>-->
    </div>
    <div class="dashboard-buttons">
      <GlobalEvents
          @keyup.s="search"
          @keypress.c="currentWidgetOpen = (currentWidgetOpen === 'chat' ? null : 'chat')"
          @keypress.a="currentWidgetOpen = (currentWidgetOpen === 'clock' ? null : 'clock')"
      />
      <div class="function-button" @click="search"><span class="key">S</span>EARCH</div>
      <div class="function-button" @click=""><span class="key">L</span>INKS</div>
      <div class="function-button" @click="currentWidgetOpen = (currentWidgetOpen === 'chat' ? null : 'chat')"><span class="key">C</span>HAT</div>
      <div class="function-button" @click="currentWidgetOpen = (currentWidgetOpen === 'clock' ? null : 'clock')"><span class="key">A</span>LARM</div>
    </div>
    <Time :open="currentWidgetOpen === 'clock'" @closeWidget="closeWidget"/>
    <Chat :open="currentWidgetOpen === 'chat'" @closeWidget="closeWidget" :chat-invite="chatInvite"/>
  </div>
</template>

<script>
import TopBar from '../components/top'
import Time from '../components/time'
import Chat from '../components/chat'

export default {
  name: 'App',
  components: {
    TopBar,
    Time,
    Chat
  },
  mounted() {
    if (this.$store.state.loggedIn) this.$playSound('beep_1')
    setInterval(this.updateDashboard, 100)

    // Check for chat and project invitations
    const url = new URL(window.location.href)
    this.chatInvite = url.searchParams.get('chat_invite')
    if (this.chatInvite) {
      this.currentWidgetOpen = 'chat'
    }
  },
  data () {
    return {
      clock: {
        percentage: 73,
        time: '----',
        suffix: '--'
      },
      currentWidgetOpen: null,
      chatInvite: null
    }
  },
  methods: {
    updateDashboard() {
      const date = new Date()
      this.clock.time = `${(date.getHours() + 11) % 12 + 1}:${((date.getMinutes() < 10) ? '0' : '' ) + date.getMinutes()}` // converted to 12-hour time
      this.clock.suffix = (date.getHours() / 12) ? 'pm' : 'am'
    },
    search() {
      window.location.href = 'https://google.com'
    },
    closeWidget() {
      this.currentWidgetOpen = null
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
  bottom: 10px;
  left: 0;
  right: 0;
  width: 100%;
  user-select: none;
  padding: 5px 0px;
  background: rgba(0, 0, 45, 0.1);
}
.dashboard-buttons div {
  width: 100%;
}
</style>
