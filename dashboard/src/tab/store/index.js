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
      state.userData = null
    },
    SET_USER(state, user) {
      state.user = user
      state.loggedIn = true
    },
    MERGE_PROFILE(state, newProfile) {
      if (state.userData) Object.assign(state.userData, newProfile)
      else state.userData = newProfile
    }
  },
  actions: {
    logOut(ctx) {
      if (!ctx.state.loggedIn) return
      ctx.commit('CLEAR_USER')
      fireAuth().signOut()
    },
    setUser(ctx, { user }) {
      // Clear user data so it doesn't interfere with new user's data
      ctx.commit('CLEAR_USER')
      // Set new user
      ctx.commit('SET_USER', user)
      // Fetch user's profile and data
      return new Promise((resolve, reject) => {
        fireStore().doc(`userProfiles/${user.uid}`).get()
        .then((snap) => {
          // Commit profile data to userData
          ctx.commit('MERGE_PROFILE', snap.data())
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
      })
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