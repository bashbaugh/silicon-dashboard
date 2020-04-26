import Vuex from 'vuex'
import Vue from 'vue'
import _ from 'lodash/core'
import { fireAuth, fireStore } from '../firebase_exports'
import defaultSettings from '../default_settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    user: null,
    userData: {
      name: null,
      chats: {}
    },
    settings: {
      sound: null,
      minimal: null,
      theme: 'dark'
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
    },
    SET_SETTINGS(state, settings) {
      state.settings = settings
    }
  },
  actions: {
    logOut(ctx) {
      if (!ctx.state.loggedIn) return
      // Vue.$playSound('whir_1')
      localStorage.clear() // Clear local storage for security purposes
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

          // Merge settings from user's profile with default settings
          const userSettings = snap.data().settings
          if (_.isEqual(Object.assign(defaultSettings, userSettings), userSettings)) {
            // New default settings need to be saved to user's profile
            ctx.dispatch('updateProfile', { settings: defaultSettings })
          }

          // Copy settings from profile and default
          ctx.commit('SET_SETTINGS', defaultSettings)
          // Emit userSet event
          document.body.dispatchEvent(new Event('userSet'))
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
          // Update settings from state and new profile
          ctx.commit('SET_SETTINGS', Object.assign(ctx.state.settings, newProfile.settings))
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
      })
    }
  }
})