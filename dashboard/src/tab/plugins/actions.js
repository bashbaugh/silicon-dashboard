import store from '../store'
import router from '../router'

const myPlugin = {}

myPlugin.install = function(Vue) {
  Vue.prototype.$playSound = function(sound) {
    if (!store.state.settings.sound && store.state.loggedIn) return
    new Audio(`/assets/sounds/${sound}.mp3`).play()
  }

  Vue.prototype.$navigate = function(route) {
    router.push('/' + route)
    Vue.prototype.$playSound('glitch_1')
  }

}

export default myPlugin