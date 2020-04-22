<template>
<div>
  <div>
    <div class="widget" :class="[open ? 'slide-in-right' : 'slide-out-right', hidden ? 'hidden' : '']">
      <div class="tabs">
        <div @click="switchTab('newChat')"><i class="fas fa-plus"></i></div>
        <div v-if="tab.chat" @click="addUser"><i class="fas fa-user-plus"></i></div>
        <div v-if="tab.chat" @click=""><i class="fas fa-users"></i></div>
        <div @click="$emit('closeWidget')"><i class="fas fa-times"></i></div>
      </div>
      <div v-if="tab.overview">
        <h3>CHAT</h3>
      </div>
      <div v-if="tab.newChat">
        <h3>INVITE PEOPLE</h3>
        <p>ANYONE WITH THIS LINK WILL BE ABLE TO JOIN THE CHAT:</p>
        <p>{{ newChat.link }}</p>
        <button @click="copyToCb(newChat.link)">Copy Invite Link</button>
        <p>{{ copyStatus }}</p>
      </div>
      <div v-if="tab.joinChat">
        <h3>JOIN CHAT</h3>
        <p>join chat {{ chatInvite }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { fireFuncs, fireStore } from '../../firebase_exports'

export default {
  name: 'Time',
  components: {
  },
  mounted() {
  },
  data () {
    return {
      hidden: true,
      currentTab: null,
      tab: {
        chat: false,
        overview: true,
        newChat: false,
        joinChat: false,
        addUser: false,
        viewUsers: false,
      },
      newChat: {
        link: 'GENERATING INVITE LINK...',
      },
      copyStatus: ''
    }
  },
  props: {
    open: Boolean,
    chatInvite: String
  },
  watch: {
    open(newVal, oldVal) {
      // Once user opens the modal, remove hidden
      if (newVal === true) {
        this.hidden = false
      }
    },
    chatInvite(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.switchTab('joinChat')
      }
    }
  },
  methods: {
    createNewChat: fireFuncs().httpsCallable('createNewChat'),
    switchTab(tab) {
      this.tab[this.currentTab] = false
      this.tab[tab] = true
      this.currentTab = tab

      switch (tab) {
        case 'newChat':
          // Create new chat
          this.createNewChat({})
          .then(({ data }) => {
            this.newChat.link = 'silicon-dashboard.netlify.app/chat-invite?chat_id=' + data.chatId
          })
          .catch((err) => {
            this.newChat.link = 'UNABLE TO GENERATE LINK: ERROR: ' + err
          })
      }
    },
    copyToCb(text) {
      navigator.clipboard.writeText(text)
      .then(() => {
        this.copyStatus = 'COPIED SUCCESSFULLY'
      }, (err) => {
        this.copyStatus = 'Unable to copy to clipboard.'
      })
    }
  }
}
</script>

<style scoped>
  .widget {
    bottom: 7%;
    right: 10px;
    width: 25%;
    height: 80%;
  }
  .tabs {
    width: 50%;
    float: right;
  }
  div[data-theme='dark'] .tabs {
    border-left: 1px solid black;
  }
  div[data-theme='light'] .tabs {
    border-left: 1px solid white;
  }
</style>
