import Vuex from 'vuex'
import Vue from 'vue'
import { fireAuth } from '../firebase_exports'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    user: null,
    userData: null
  },
  getters: {

  },
  mutations: {
    CLEAR_USER(state) {
      state.loggedIn = false
      state.user = null
    },
    SET_USER(state, user) {
      state.user = user
      state.loggedIn = true
    }
  },
  actions: {
    logOut(ctx) {
      if (!ctx.state.loggedIn) return
      ctx.commit('CLEAR_USER')
      fireAuth.signOut()
    },
    setUser(ctx, { user }) {
      ctx.commit('SET_USER', user)
    }
  }
})