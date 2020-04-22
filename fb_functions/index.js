const chatApi = require('./api/chat')
const admin = require('firebase-admin')

admin.initializeApp()

/* Chat Api */
exports.createNewChat = chatApi.createNewChat
