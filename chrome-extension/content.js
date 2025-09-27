// Chrome Extension Content Script
(function() {
  'use strict';

  // Detect if we're on an e-commerce site
  function isEcommerceSite() {
    const hostname = window.location.hostname.toLowerCase();
    const ecommerceSites = [
      'amazon', 'ebay', 'aliexpress', 'temu', 'shein', 'wish', 
      'etsy', 'shopify', 'magento', 'woocommerce', 'bigcommerce'
    ];
    
    return ecommerceSites.some(site => hostname.includes(site));
  }

  // Extract product information from the page
  function extractProductInfo() {
    const url = window.location.href;
    const title = document.title;
    
    // Try to find product name in common selectors
    const productNameSelectors = [
      'h1[data-testid="product-title"]',
      '.product-title',
      '.product-name',
      'h1.product-title',
      '[data-testid="product-name"]',
      '.pdp-product-name',
      '.product-detail-name',
      'h1'
    ];
    
    let productName = '';
    for (const selector of productNameSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        productName = element.textContent.trim();
        break;
      }
    }

    return {
      url,
      title,
      productName: productName || title,
      timestamp: Date.now()
    };
  }

  // Add SwissSafe button to the page
  function addSwissSafeButton() {
    // Check if button already exists
    if (document.getElementById('swisssafe-button')) {
      return;
    }

    const button = document.createElement('div');
    button.id = 'swisssafe-button';
    button.innerHTML = `
      <div class="swisssafe-button-container">
        <button class="swisssafe-button" title="Check with SwissSafe">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"/>
          </svg>
          <span>SwissSafe</span>
        </button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .swisssafe-button-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .swisssafe-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: linear-gradient(45deg, #10b981, #06b6d4);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }
      
      .swisssafe-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .swisssafe-button:active {
        transform: translateY(0);
      }
      
      .swisssafe-button svg {
        width: 14px;
        height: 14px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(button);

    // Add click handler
    button.addEventListener('click', () => {
      const productInfo = extractProductInfo();
      
      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'openPopup',
        productInfo: productInfo
      });
    });
  }

  // Show notification for product check results
  function showNotification(result) {
    const notification = document.createElement('div');
    notification.className = 'swisssafe-notification';
    notification.innerHTML = `
      <div class="swisssafe-notification-content">
        <div class="swisssafe-notification-header">
          <div class="swisssafe-notification-icon ${result.status.replace(/\s+/g, '-').toLowerCase()}"></div>
          <div class="swisssafe-notification-title">SwissSafe Result</div>
          <button class="swisssafe-notification-close">&times;</button>
        </div>
        <div class="swisssafe-notification-body">
          <div class="swisssafe-notification-status">${result.status}</div>
          <div class="swisssafe-notification-confidence">Confidence: ${Math.round(result.confidence * 100)}%</div>
          <div class="swisssafe-notification-reasoning">${result.reasoning}</div>
        </div>
      </div>
    `;

    // Add notification styles
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
      .swisssafe-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10001;
        max-width: 350px;
        background: rgba(31, 41, 55, 0.95);
        border: 1px solid #374151;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
        animation: slideInRight 0.3s ease;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .swisssafe-notification-content {
        padding: 16px;
      }
      
      .swisssafe-notification-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .swisssafe-notification-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
      
      .swisssafe-notification-title {
        font-weight: 600;
        flex: 1;
      }
      
      .swisssafe-notification-close {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .swisssafe-notification-status {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        text-transform: capitalize;
      }
      
      .swisssafe-notification-confidence {
        font-size: 12px;
        color: #9ca3af;
        margin-bottom: 8px;
      }
      
      .swisssafe-notification-reasoning {
        font-size: 13px;
        line-height: 1.4;
        color: #d1d5db;
      }
      
      .status-possibly-legal .swisssafe-notification-icon {
        background: rgba(16, 185, 129, 0.2);
        color: #6ee7b7;
      }
      
      .status-likely-legal .swisssafe-notification-icon {
        background: rgba(16, 185, 129, 0.3);
        color: #34d399;
      }
      
      .status-possibly-illegal .swisssafe-notification-icon {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
      }
      
      .status-likely-illegal .swisssafe-notification-icon {
        background: rgba(239, 68, 68, 0.3);
        color: #f87171;
      }
    `;

    document.head.appendChild(notificationStyle);
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 10000);

    // Close button handler
    notification.querySelector('.swisssafe-notification-close').addEventListener('click', () => {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showNotification') {
      showNotification(request.result);
    }
  });

  // Initialize on e-commerce sites
  if (isEcommerceSite()) {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addSwissSafeButton);
    } else {
      addSwissSafeButton();
    }
  }
})();
