<template>
<div>
  <div>
    <div class="widget" :class="[open ? 'slide-in-right' : 'slide-out-right', hidden ? 'hidden' : '']">
      <div class="tabs">
        <div @click="switchTab('overview')" :class="{ 'active': tab.overview }"><i class="fas fa-list"></i></div>
        <div v-if="tab.overview || tab.newChat" @click="switchTab('newChat')" :class="{ 'active': tab.newChat }"><i class="fas fa-plus"></i></div>
        <div v-if="tab.chat" @click=""><i class="fas fa-user-plus"></i></div>
         <div v-if="tab.chat" @click=""><i class="fas fa-users"></i></div>
        <div v-if="tab.chat" @click="switchTab('chatSettings')"><i class="fas fa-cog"></i></div>
        <div @click="$emit('closeWidget')"><i class="fas fa-times"></i></div>
      </div>
      <div v-if="tab.overview">
        <h3>CHAT LIST</h3>
        <p>{{ status }}</p>
        <div class="chat" v-for="[chatid, chat] of chat.list">
          <span class="clickable" @click="openChat(chatid)">{{ chatid }}</span>
          <span class="clickable chat-button" @click="openChat(chatid)">&gt;</span>
          <span class="clickable chat-button" @click="openChat(chatid, 'settings')"><i class="fas fa-ellipsis-v"></i></span>
        </div>
      </div>
      <div v-if="tab.chat">
        <h3>CHAT</h3>
        <p>{{ chat.current }}</p>
      </div>
      <div v-if="tab.chatSettings">
        <h3>SETTINGS</h3>
        settings for chat {{ chat.current }}
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
        chatSettings: false
      },
      newChat: {
        link: null,
      },
      chat: {
        current: null
      },
      status: ''
    }
  },
  props: {
    open: Boolean,
    chatInvite: String
  },
  mounted() {
    document.body.addEventListener('userSet', () => {
      this.$store.dispatch('initializeChat')
    })
  },
  watch: {
    open(newVal, oldVal) {
      // Once user opens the modal, remove hidden
      if (newVal && this.hidden) {
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
    submitCreateNewChat: fireFuncs().httpsCallable('createNewChat'),
    switchTab(tab) {
      this.tab[this.currentTab] = false
      this.tab[tab] = true
      this.currentTab = tab
      this.status = ''

      switch (tab) {
        case 'newChat':
          this.createNewChat()
          break
        case 'chat':
          if (!this.chat.current) this.switchTab('overview')
      }
    },
    openChat(id, page) {
      this.chat.current = id
      this.switchTab('chat')
      if (page === 'settings') this.switchTab('chatSettings')
    },
    localSaveChat() {
      // Create a new map with only the information we need to save
      let saveChatList = new Map(this.chat.list)
      saveChatList.forEach((chat, chatid, map) => {
        map.set(chatid, {
          name: chat.name
        })
      })
      // Save JSON stringified map to local storage
      localStorage.setItem('chatList', JSON.stringify(Array.from(saveChatList.entries())))
    },
    copyToCb(text) {
      navigator.clipboard.writeText(text)
      .then(() => {
        this.status = 'COPIED SUCCESSFULLY'
      }, (err) => {
        this.status = 'Unable to copy to clipboard.'
      })
    },
    createNewChat() {
      // Create new chat
      let newChatId
      this.submitCreateNewChat({})
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
    },
    joinChat() {
      this.status = 'PLEASE WAIT...'
      fireStore().doc(`/chats/${this.chatInvite}/users/${this.$store.state.user.uid}`).set({
        name: this.$store.state.userData.name
      })
      .then(() => {
        // Add chat to user
        const chatsObject = {}
        chatsObject[this.chatInvite] = { visible: true }
        this.$store.dispatch('updateProfile', { chats: chatsObject })
        this.chat.list.set(this.chatInvite, {
          name: 'chatname' // TODO Fetch chat info
        })
        this.localSaveChat()

        // Set chat and switch to chat tab
        this.chat.current = this.chatInvite
        this.switchTab('chat')
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
  .chat {
    padding: 15px;
    text-align: left;
  }
  div[data-theme='light'] .chat {
    border-bottom: 1px  solid white;
  }
  div[data-theme='dark'] .chat {
    border-bottom: 1px solid black;
  }
  .chat .chat-button {
    float: right;
    padding: 0px 12px;
  }
</style>
