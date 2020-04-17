<template>
  <div>
    <TopBar title="SILICON: AUTHORIZATION" :status="headerStatus" :control-key="headerKey"/>
    <div class="center" @keyup.esc="restartAuth">
      <div class="large-input-prompt">{{ inputPrompt }}</div>
      <div class="large-input-container">
        <input v-model="userInput" @input="inputChanged" @keydown.enter="processInput" ref="input" type="text" required :maxlength="currentStep === 1 ? '16' : null" :disabled="inputDisabled">
      </div>
      <div :class="['large-input-status', inputStatusWarning ? 'red' : 'green']">CURRENT STATUS: &nbsp; AUTH://{{ inputStatus }}</div>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/top'
import { fireAuth } from '../../firebase_exports'

const initialData = {
  headerKey: '⏎',
  headerStatus: 'TO SUBMIT',

  userInput: '',
  inputPrompt: 'ENTER YOUR EMAIL',
  inputStatus: 'WAITING_FOR_INPUT',
  inputStatusWarning: false,
  inputDisabled: false,
  currentStep: 0, // 0 = email, 1 = name (skipped for valid email), 2 = password for register (skipped for valid email), 3 = password for login (skipped for new users)

  userEmail: '',
  userName: '',
}

export default {
  name: 'Login',
  components: {
    TopBar
  },
  data () {
    return initialData
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    processInput() {
      this.inputDisabled = true
      this.inputStatusWarning = false
      this.inputStatus = 'PROCESSING_USER_INPUT'
      switch (this.currentStep) {
        case 0:
          fireAuth().fetchSignInMethodsForEmail(this.userInput)
          .then((signInMethods) => {
            if (signInMethods.length === 0) {
              this.userEmail = this.userInput
              this.userInput = ''
              this.inputPrompt = 'ENTER YOUR NAME'
              this.inputStatus = 'REQUESTING_NAME'
              this.currentStep = 1
            } else {
              this.userInput = ''
              this.inputPrompt = 'ENTER YOUR PASSWORD'
              this.inputStatus = 'REQUESTING_PASSKEY'
              this.currentStep = 3
            }
            this.inputDisabled = false
            this.$refs.input.focus()
          })
          .catch((err) => {
            this.inputStatusWarning = true
            this.inputStatus = 'EMAIL_INVALID :: PLEASE RE-ENTER'
            this.inputDisabled = false
            this.$refs.input.focus()
          })
          return
        case 1:
          this.userName = this.userInput
          this.userInput = ''
          this.inputPrompt = 'CHOOSE A PASSWORD'
          this.inputStatus = 'WAITING_FOR_PASSKEY'
          this.currentStep = 2
          this.inputDisabled = false
          this.$refs.input.focus()
          return
        case 2:
          this.inputStatus = 'INITIALIZING_NEW_USER'
          fireAuth().createUserWithEmailAndPassword(this.userEmail, this.userInput)
          .then((userCred) => {
            setTimeout(() => { this.$router.replace('/') }, 1000)
          })
          .catch(({ code, message }) => {
            this.inputStatusWarning = true
            if (code === 'auth/weak-password') {
              this.inputStatus = 'PASSWORD_TOO_WEAK ::: INCLUDE NUMBERS, LETTERS, AND SYMBOLS'
            } else {
              this.inputStatus = `LOGIN_ERROR: ${message}`
            }
            this.inputDisabled = false
            this.$refs.input.focus()
          })
          return
        case 3:
          fireAuth().signInWithEmailAndPassword(this.userEmail, this.userInput)
          .then((userCred) => {
            this.$router.replace('/')
          })
          .catch(({ code, message }) => {
            this.inputStatusWarning = true
            if (code === 'auth/user-disabled') {
              this.inputStatus = 'ACCOUNT_DISABLED :: YOUR ACCOUNT HAS BEEN DISABLED'
            } else if (code === 'auth/wrong-password') {
              this.inputStatus = 'WRONG_PASSWORD :: PLEASE TRY AGAIN OR PRESS ESC TO RESTART'
            } else {
              this.inputStatus = `LOGIN_ERROR: ${message}`
            }
            this.inputDisabled = false
            this.$refs.input.focus()
          })
          return
      }
    },
    inputChanged() {
      if (this.currentStep === 1) this.userInput = this.userInput.replace(' ', '_')
    },
    restartAuth() {
      Object.assign(this.$data, initialData)
    }
  }
}
</script>

<style scoped>

</style>
