<template>
<div>
  <div>
    <div class="widget" :class="[open ? 'slide-in-right' : 'slide-out-right', hidden ? 'hidden' : '']">
      <div class="tabs">
        <div @click="switchTab('overview')" :class="{ 'active': tab.overview }"><i class="fas fa-home"></i></div>
        <div v-if="tab.overview || tab.newChat" @click="switchTab('newChat')" :class="{ 'active': tab.newChat }"><i class="fas fa-plus"></i></div>
        <div v-if="tab.chat" @click="addUser"><i class="fas fa-user-plus"></i></div>
        <div v-if="tab.chat" @click=""><i class="fas fa-users"></i></div>
        <div @click="$emit('closeWidget')"><i class="fas fa-times"></i></div>
      </div>
      <div v-if="tab.overview">
        <h3>CHAT</h3>
      </div>
      <div v-if="tab.newChat">
        <h3>NEW CHAT</h3>
        <h3>INVITE PEOPLE</h3>
        <p>ANYONE WITH THIS LINK WILL BE ABLE TO JOIN THE CHAT:</p>
        <p class="selectable">{{ newChat.link || 'GENERATING LINK...' }}</p>
        <button @click="copyToCb(newChat.link)" v-if="newChat.link">COPY INVITE LINK</button>
        <p>{{ status }}</p>
      </div>
      <div v-if="tab.joinChat">
        <h3>JOIN CHAT</h3>
        <p>YOU HAVE BEEN INVITED TO JOIN CHAT {{ shortenedChatInvite }}. </p>
        <p>CLICK THE BUTTON BELOW TO JOIN THE CHAT.</p>
        <button @click="joinChat">JOIN</button>
        <p>{{ status }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { fireFuncs, fireStore } from '../../firebase_exports'
import _ from 'lodash'

export default {
  name: 'Time',
  components: {
  },
  mounted() {
  },
  data () {
    return {
      hidden: true,
      currentTab: 'overview',
      tab: {
        chat: false,
        overview: true,
        newChat: false,
        joinChat: false,
        addUser: false,
        viewUsers: false,
      },
      newChat: {
        link: null,
      },
      status: ''
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
  computed: {
    shortenedChatInvite() {
      return '#' + _.truncate(this.chatInvite, { length: 6, omission: '' })
    }
  },
  methods: {
    createNewChat: fireFuncs().httpsCallable('createNewChat'),
    switchTab(tab) {
      this.tab[this.currentTab] = false
      this.tab[tab] = true
      this.currentTab = tab
      this.status = ''

      switch (tab) {
        case 'newChat':
          // Create new chat
          let newChatId
          this.createNewChat({})
          .then(({ data }) => {
            newChatId = data.chatId
            // Add user to chat
            return fireStore().doc(`/chats/${newChatId}/users/${this.$store.state.user.uid}`).set({
              owner: true
            })
          })
          .then(() => {
            // Add chat to user chats
            const chatsObject = {}
            chatsObject[newChatId] = { visible: true }
            return this.$store.dispatch('updateProfile', { chats: chatsObject })
          })
          .then(() => {
            // Finally, display chat link
            this.newChat.link = 'silicon-dashboard.netlify.app/chat-invite?chat_id=' + newChatId
          })
          .catch((err) => {
            this.newChat.link = 'UNABLE TO CREATE NEW CHAT: ERROR: ' + err
          })
      }
    },
    copyToCb(text) {
      navigator.clipboard.writeText(text)
      .then(() => {
        this.status = 'COPIED SUCCESSFULLY'
      }, (err) => {
        this.status = 'Unable to copy to clipboard.'
      })
    },
    joinChat() {
      this.status = 'PLEASE WAIT...'
      fireStore().doc(`/chats/${this.chatInvite}/pendingUsers/${this.$store.state.user.uid}`).set({
        pending: true
      })
      .then(() => {
        this.status = 'DONE. YOU WILL BE ABLE TO ACCESS THE CHAT ONCE THE OWNER ADMITS YOU'
      })
      .catch((err) => {
        this.status = 'UNABLE TO JOIN - EITHER THE CHAT DOES NOT EXIST OR YOU HAVE BEEN BLOCKED.'
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
