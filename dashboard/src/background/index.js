import setListeners from './listeners'
import firebaseExports from './firebase'

setListeners()

// Global window variables for extension to access
window.firebase = firebaseExports;
