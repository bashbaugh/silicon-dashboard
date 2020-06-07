const { fireStore } = chrome.extension.getBackgroundPage().firebase;

export default {
  state: () => ({
    list: new Map()
  }),
  mutations: {

  },
  actions: {
    initializeChat(ctx) {
    //   let userChats = {}
    //   fireStore().doc('userProfiles/' + this.$store.state.user.uid).get()
    //   .then((docSnap) => {
    //     // Take array of chat IDs
    //     userChats = Object.keys(docSnap.data().chats)
    //
    //     // Because firebase limits 'in' queries to 10 matches each, we have to split the chats into multiple queries
    //     // First, create array of promises for each group of 10 chats
    //     let queryResults = []
    //     let queryPromises = []
    //     for (let i = 0; i < userChats.length; i += 10) {
    //       queryPromises.push(fireStore().collection('chats').where(fireStore.FieldPath.documentId(), 'in', userChats.slice(i, i + 10)).get())
    //     }
    //     // Run the promises
    //     Promise.all(queryPromises)
    //     .then((querySnaps) => {
    //       // Add each query snapshot to results array
    //       for (const querySnap of querySnaps) {
    //         queryResults.push(querySnap.docs)
    //       }
    //       // Flatten the array of arrays into an array of QueryDocumentSnapshots
    //       queryResults = queryResults.flat()
    //
    //       // Add the results to the chat list
    //       for (const queryDocSnap of queryResults) {
    //         this.chat.list.set(queryDocSnap.id, queryDocSnap.data())
    //       }
    //       this.localSaveChat()
    //     })
    //     .catch((err) => {
    //       this.status = 'UNABLE TO GET CHAT DATA: ' + err
    //     })
    //   })
    //   .catch((err) => {
    //     this.status = 'UNABLE TO GET CHAT LIST: ' + err
    //   })
    }
  }
}