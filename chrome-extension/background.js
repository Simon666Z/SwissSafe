// chrome extension background script
chrome.runtime.onInstalled.addListener(() => {
  console.log('SwissSafe extension installed');
});

// handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkProduct') {
    checkProductLegality(request.url)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function checkProductLegality(url) {
  const apiUrl = 'http://localhost:8000';
  
  try {
    const response = await fetch(`${apiUrl}/check-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking product legality:', error);
    throw error;
  }
}

// context menu for right click
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkProductLegality',
    title: 'Check with SwissSafe',
    contexts: ['link', 'page'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkProductLegality') {
    let url = info.linkUrl || info.pageUrl;
    
    // open popup with url
    chrome.action.openPopup();
    
    // send message to popup
    chrome.runtime.sendMessage({
      action: 'setUrl',
      url: url
    });
  }
});
