import Vuex from 'vuex'
import Vue from 'vue'
import { fireAuth, fireStore } from '../firebase_exports'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    user: null,
    userData: {
      name: null
    }
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
    },
    MERGE_PROFILE(state, newProfile) {
      Object.assign(state.userData, newProfile)
    }
  },
  actions: {
    logOut(ctx) {
      if (!ctx.state.loggedIn) return
      ctx.commit('CLEAR_USER')
      fireAuth().signOut()
    },
    setUser(ctx, { user }) {
      ctx.commit('SET_USER', user)
    },
    updateProfile(ctx, newProfile) {
      return new Promise((resolve, reject) => {
        fireStore().doc(`userProfiles/${ctx.state.user.uid}`).set(newProfile, { merge: true })
        .then((docref) => {
          // Commit new profile data to userData
          ctx.commit('MERGE_PROFILE', newProfile)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
      })
    }
  }
})