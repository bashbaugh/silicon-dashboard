// Initialize redirects for chat and project invites

chrome.webRequest.onBeforeRequest.addListener((details) => {
  // Get chat ID from URL params
  const inviteCode = new URL(details.url).searchParams.get('chat_id')
  // Redirect to extension URL
  return {
    redirectUrl: chrome.runtime.getURL('/tab/tab.html?chat_invite=' + inviteCode)
  }
}, {
  urls: [
    `*://silicon-dashboard.netlify.app/chat-invite?*`
  ]
}, ['blocking'])