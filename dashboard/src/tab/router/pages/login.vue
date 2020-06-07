<template>
  <div>
    <TopBar title="SILICON: AUTHENTICATION" @submitbtn="processInput" @restartbtn="restartAuth" @resetpwdbtn="resetPassword"/>
    <div class="center">
      <div class="large-input-prompt">{{ inputPrompt }}</div>
      <div class="large-input-container">
        <GlobalEvents @keyup.esc="restartAuth"/>
        <input
            class="large"
            v-model="userInput"
            @input="inputChanged"
            @keydown.enter="processInput"
            ref="input"
            :type="(currentStep === 2 || currentStep === 3) ? 'password' : 'text'"
            required
            :maxlength="currentStep === 1 ? '16' : null"
            :disabled="inputDisabled" >
      </div>
      <div :class="['large-input-status', inputStatusWarning ? 'red' : 'green']">CURRENT STATUS: &nbsp; AUTH://<span class="typer-span" ref="statusRef" id="statusRef"></span></div>
      <div class="large-input-status" v-if="currentStep === 2 || currentStep === 1">BY CONTINUING TO USE THIS EXTENSION, YOU ACKNOWLEDGE YOUR AGREEMENT TO OUR <a :href="privacyPolicyUrl" target="_blank">PRIVACY POLICY</a></div>
    </div>
  </div>
</template>

<script>
import typer from 'typer-js'
import TopBar from '../components/top'
import cfg from '../../../appconfig'

const { fireAuth } = chrome.extension.getBackgroundPage().firebase

function initialData() {
  return {
    userInput: '',

    inputPrompt: 'ENTER YOUR EMAIL',
    inputStatus: null,
    inputStatusWarning: false,
    inputDisabled: false,
    currentStep: 0,
    // 0 = email, 1 = name (skipped for valid email), 2 = password for register (skipped for valid email), 3 = password for login (skipped for new users), 4 = reset password

    userEmail: '',
    userName: '',

    typerQueueLength: 0,

    privacyPolicyUrl: cfg.privacyPolicy
  }
}

export default {
  name: 'Login',
  components: {
    TopBar,
  },
  data () {
    return initialData()
  },
  mounted() {
    this.$refs.input.focus()

    this.inputStatus = typer('#statusRef', { speed: 20 })
    .cursor({ block: true })

    this.statusType('WAITING_FOR_INPUT')

  },
  methods: {
    statusType(str, warning) {
      this.inputStatusWarning = warning

      this.typerQueueLength ++

      this.inputStatus
      .run(() => {
        this.typerQueueLength -- // Subtract from typer queue
      })
      .empty()
      .line(str)
      .run(() => {
        setTimeout(() => {
          // If there are more lines in the queue, emit the type event again to start the next line
          if (this.typerQueueLength) document.body.dispatchEvent(new Event('typer-type'))
        }, 20) // But wait until after .listen has been called
      })
      .listen('typer-type') // Pause and wait for type event

      document.body.dispatchEvent(new Event('typer-type')) // Start typing
    },
    processInput() {
      this.inputDisabled = true
      this.inputStatusWarning = false
      this.statusType('PROCESSING_USER_INPUT')
      switch (this.currentStep) {
        case 0:
          fireAuth().fetchSignInMethodsForEmail(this.userInput)
          .then((signInMethods) => {
            this.$playSound('clink_1')
            this.userEmail = this.userInput
            this.userInput = ''
            if (signInMethods.length === 0) {
              this.inputPrompt = 'ENTER YOUR NAME'
              this.statusType('REQUESTING_NAME')
              this.currentStep = 1
            } else {
              this.inputPrompt = 'ENTER YOUR PASSWORD'
              this.statusType('REQUESTING_PASSKEY')
              this.currentStep = 3
            }
            this.inputDisabled = false
            this.$nextTick(() => {this.$refs.input.focus()})
          })
          .catch((err) => {
            this.$playSound('clicks_1')
            this.statusType('EMAIL_INVALID :: PLEASE RE-ENTER', true)
            this.inputDisabled = false
            this.$nextTick(() => {this.$refs.input.focus()})
          })
          return
        case 1:
          this.$playSound('clink_1')
          this.userName = this.userInput
          this.userInput = ''
          this.inputPrompt = `CHOOSE A PASSWORD, ${this.userName}`
          this.statusType('WAITING_FOR_PASSKEY')
          this.currentStep = 2
          this.inputDisabled = false
          this.$nextTick(() => {this.$refs.input.focus()})
          return
        case 2:
          this.statusType('INITIALIZING_NEW_USER')
          fireAuth().createUserWithEmailAndPassword(this.userEmail, this.userInput)
          .then((userCred) => {
            this.$store.dispatch('setUser', { user: userCred.user })
            this.$store.dispatch('updateProfile', { name: this.userName })
            .then(() => {
              this.$playSound('clink_1')
              setTimeout(() => { this.$router.replace('/') }, 1000)
            })
            .catch((err) => {
              this.$playSound('clicks_1')
              this.statusType(`PROFILE_SET_ERROR: ${err}`, true)
              setTimeout(() => { this.$router.replace('/profile') }, 5000)
            })
          })
          .catch(({ code, message }) => {
            this.$playSound('clicks_1')
            if (code === 'auth/weak-password') {
              this.statusType('PASSWORD_TOO_WEAK ::: MUST BE 6 CHARACTERS OR LONGER', true)
            } else {
              this.statusType(`LOGIN_ERROR: ${message}`, true)
            }
            this.inputDisabled = false
            this.$nextTick(() => {this.$refs.input.focus()})
          })
          return
        case 3:
          fireAuth().signInWithEmailAndPassword(this.userEmail, this.userInput)
          .then((userCred) => {
            this.$playSound('clink_1')
            this.$store.dispatch('setUser', { user: userCred.user })
            this.$router.replace('/')
          })
          .catch(({ code, message }) => {
            this.$playSound('clicks_1')
            if (code === 'auth/user-disabled') {
              this.statusType('ACCOUNT_DISABLED :: YOUR ACCOUNT HAS BEEN DISABLED', true)
            } else if (code === 'auth/wrong-password') {
              this.statusType('WRONG_PASSWORD :: PLEASE TRY AGAIN OR PRESS ESC TO RESTART', true)
            } else {
              this.statusType(`LOGIN_ERROR: ${message}`, true)
            }
            this.inputDisabled = false
            this.$nextTick(() => {this.$refs.input.focus()})
          })
          return
        case 4:
          fireAuth().sendPasswordResetEmail(this.userInput, { url: 'https://silicon-dashboard.netlify.app/passwordreset'})
          .then(() => {
            this.$playSound('clink_1')
            this.inputDisabled = true
            this.inputPrompt = 'PASSWORD RESET EMAIL SENT'
            this.statusType('RESET_EMAIL_SENT: please check your email')
          })
          .catch(({ code, message }) => {
            this.$playSound('clicks_1')
            this.inputDisabled = false
            if (code === 'auth/invalid-email') {
              this.statusType('INVALID_EMAIL: That\'s not a valid email', true)
            } else if (code === 'auth/user-not-found') {
              this.statusType('ACCOUNT_NOT_FOUND: Try again or press ESC to create new account', true)
            } else {
              this.statusType('UNKNOWN_ERROR_OCCURRED: ' + message, true)
            }
          })
      }
    },
    inputChanged() {
      if (this.currentStep === 1) this.userInput = this.userInput.replace(' ', '_')
    },
    restartAuth() {
      this.$playSound('whir_1')
      this.inputStatus.kill()

      Object.assign(this.$data, initialData())

      this.inputStatus = typer('#statusRef', { speed: 20 })
      .cursor({ block: true })

      this.statusType('WAITING_FOR_INPUT')
    },
    resetPassword() {
      this.userInput = ''
      this.statusType('CONFIRMING_EMAIL')
      this.inputPrompt = 'ENTER YOUR EMAIL TO RESET YOUR PASSWORD'
      this.currentStep = 4
      this.$refs.input.focus()
    }
  },
  watch: {
    typerFinished (newVal, oldVal) {
      if (newVal && !oldVal) {

      }
    }
  }
}
</script>

<style scoped>

</style>
