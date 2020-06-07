import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/functions'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCGCKTiekfMNxbITbkL2w6nrs40QzvRKl0",
  authDomain: "silicon-dashboard.firebaseapp.com",
  databaseURL: "https://silicon-dashboard.firebaseio.com",
  projectId: "silicon-dashboard",
  storageBucket: "silicon-dashboard.appspot.com",
  messagingSenderId: "944838978229",
  appId: "1:944838978229:web:08c7625a68fd8650eb6cfc"
}

firebase.initializeApp(firebaseConfig)

const fireAuth = firebase.auth
const fireFuncs = firebase.functions
const fireStore = firebase.firestore

export default { fireAuth, fireFuncs, fireStore }