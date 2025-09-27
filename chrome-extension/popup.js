// Chrome Extension Popup Script
class SwissSafePopup {
  constructor() {
    this.apiUrl = 'http://localhost:8000';
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadHistory();
    this.detectCurrentUrl();
  }

  bindEvents() {
    const checkBtn = document.getElementById('checkBtn');
    const urlInput = document.getElementById('urlInput');
    const clearHistoryBtn = document.getElementById('clearHistory');

    checkBtn.addEventListener('click', () => this.checkProduct());
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.checkProduct();
      }
    });
    clearHistoryBtn.addEventListener('click', () => this.clearHistory());
  }

  async detectCurrentUrl() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        const urlInput = document.getElementById('urlInput');
        urlInput.value = tab.url;
      }
    } catch (error) {
      console.log('Could not detect current URL:', error);
    }
  }

  async checkProduct() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
      this.showError('Please enter a product URL');
      return;
    }

    if (!this.isValidUrl(url)) {
      this.showError('Please enter a valid URL');
      return;
    }

    this.setLoading(true);
    this.hideError();
    this.hideResult();

    try {
      const response = await fetch(`${this.apiUrl}/check-product`, {
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
      this.showResult(result);
      this.saveToHistory(url, result);
    } catch (error) {
      console.error('Error checking product:', error);
      this.showError('Failed to check product legality. Please make sure the SwissSafe backend is running.');
    } finally {
      this.setLoading(false);
    }
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  setLoading(loading) {
    const checkBtn = document.getElementById('checkBtn');
    const buttonText = checkBtn.querySelector('.button-text');
    const spinner = checkBtn.querySelector('.spinner');

    if (loading) {
      checkBtn.disabled = true;
      buttonText.textContent = 'Checking...';
      spinner.classList.remove('hidden');
    } else {
      checkBtn.disabled = false;
      buttonText.textContent = 'Check Legality';
      spinner.classList.add('hidden');
    }
  }

  showResult(result) {
    const resultContainer = document.getElementById('result');
    const statusIcon = resultContainer.querySelector('.status-icon');
    const statusText = resultContainer.querySelector('.status-text');
    const confidenceFill = resultContainer.querySelector('.confidence-fill');
    const confidencePercentage = resultContainer.querySelector('.confidence-percentage');
    const reasoningText = resultContainer.querySelector('.reasoning-text');

    // Set status
    const status = result.status.replace(/\s+/g, '-').toLowerCase();
    statusText.textContent = result.status;
    statusIcon.className = `status-icon ${status}`;
    
    // Set confidence
    const confidence = Math.round(result.confidence * 100);
    confidencePercentage.textContent = `${confidence}%`;
    confidenceFill.style.width = `${confidence}%`;
    
    // Set confidence bar color
    confidenceFill.className = 'confidence-fill';
    if (confidence >= 70) {
      confidenceFill.classList.add('confidence-high');
    } else if (confidence >= 50) {
      confidenceFill.classList.add('confidence-medium');
    } else {
      confidenceFill.classList.add('confidence-low');
    }

    // Set reasoning
    reasoningText.textContent = result.reasoning;

    resultContainer.classList.remove('hidden');
  }

  hideResult() {
    const resultContainer = document.getElementById('result');
    resultContainer.classList.add('hidden');
  }

  showError(message) {
    const errorContainer = document.getElementById('error');
    const errorMessage = errorContainer.querySelector('.error-message');
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
  }

  hideError() {
    const errorContainer = document.getElementById('error');
    errorContainer.classList.add('hidden');
  }

  saveToHistory(url, result) {
    chrome.storage.local.get(['history'], (data) => {
      const history = data.history || [];
      const newItem = {
        url,
        status: result.status,
        confidence: result.confidence,
        timestamp: Date.now(),
      };

      // Remove existing entry for this URL
      const filteredHistory = history.filter(item => item.url !== url);
      
      // Add new entry at the beginning
      const updatedHistory = [newItem, ...filteredHistory].slice(0, 10); // Keep only last 10

      chrome.storage.local.set({ history: updatedHistory }, () => {
        this.loadHistory();
      });
    });
  }

  loadHistory() {
    chrome.storage.local.get(['history'], (data) => {
      const history = data.history || [];
      const historyList = document.getElementById('historyList');
      
      if (history.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: #6b7280; font-size: 12px; padding: 20px;">No recent checks</div>';
        return;
      }

      historyList.innerHTML = history.map(item => {
        const statusClass = item.status.replace(/\s+/g, '-').toLowerCase();
        const confidence = Math.round(item.confidence * 100);
        const shortUrl = this.shortenUrl(item.url);
        
        return `
          <div class="history-item" data-url="${item.url}">
            <div class="history-url" title="${item.url}">${shortUrl}</div>
            <div class="history-status ${statusClass}">${item.status} (${confidence}%)</div>
          </div>
        `;
      }).join('');

      // Add click handlers to history items
      historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.dataset.url;
          document.getElementById('urlInput').value = url;
          this.checkProduct();
        });
      });
    });
  }

  shortenUrl(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const path = urlObj.pathname;
      
      if (path.length > 30) {
        return `${domain}${path.substring(0, 30)}...`;
      }
      return `${domain}${path}`;
    } catch {
      return url.length > 40 ? url.substring(0, 40) + '...' : url;
    }
  }

  clearHistory() {
    chrome.storage.local.remove(['history'], () => {
      this.loadHistory();
    });
  }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SwissSafePopup();
});
