const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.createNewChat = functions.https.onCall((data, context) => {
  return admin.firestore().collection('chats').add({
    owner: context.auth.uid
  })
  .then((docref) => {
    return {
      chatId: docref.id
    }
  })
})