// Initialize redirects for chat and project invites, etc.

import cfg from '../appconfig'

export default function setListeners() {
  chrome.runtime.setUninstallURL(cfg.uninstall)

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install' || details.reason === 'update') {
      chrome.tabs.create({ url: chrome.runtime.getURL(`/tab/tab.html?reason=${details.reason}#/updated`) })
    }
  })

  chrome.webRequest.onBeforeRequest.addListener((details) => {
    // Get chat ID from URL params
    const inviteCode = new URL(details.url).searchParams.get('chat_id')
    // Redirect to extension URL
    return {
      redirectUrl: chrome.runtime.getURL('/tab/tab.html?chat_invite=' + inviteCode)
    }
  }, {
    urls: [
      `*://${cfg.websiteUrl}/chat-invite?*`
    ]
  }, ['blocking'])
}
