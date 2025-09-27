# SwissSafe Chrome Extension

A Chrome extension for checking product legality in Switzerland using AI-powered analysis.

## Features

- **Quick Product Check**: Check any product URL for Swiss import legality
- **Smart URL Detection**: Automatically detects current page URL when opening the extension
- **Visual Results**: Clear status indicators with confidence levels
- **History**: Keep track of recent product checks
- **E-commerce Integration**: Adds SwissSafe button on e-commerce sites
- **Context Menu**: Right-click any link to check with SwissSafe

## Installation

### Development Installation

1. **Start the SwissSafe Backend**:
   ```bash
   cd backend
   export SWISS_AI_PLATFORM_API_KEY="your-api-key"
   python main.py
   ```

2. **Load the Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Pin SwissSafe for easy access

## Usage

### Method 1: Extension Popup
1. Click the SwissSafe extension icon
2. Enter a product URL or use the auto-detected current page URL
3. Click "Check Legality"
4. View the result with confidence level and analysis

### Method 2: E-commerce Sites
1. Visit any e-commerce site (Amazon, Temu, Shein, etc.)
2. Look for the floating SwissSafe button in the top-right corner
3. Click the button to check the current product

### Method 3: Context Menu
1. Right-click on any product link
2. Select "Check with SwissSafe"
3. The extension popup will open with the URL pre-filled

## Status Types

- **Possibly Legal**: Confidence ≥ 50%, likely safe for import
- **Likely Legal**: Confidence < 50%, probably safe for import
- **Possibly Illegal**: Confidence ≥ 50%, likely prohibited
- **Likely Illegal**: Confidence < 50%, probably prohibited

## Requirements

- Chrome browser (Manifest V3 compatible)
- SwissSafe backend running on `http://localhost:8000`
- Internet connection for AI analysis

## Troubleshooting

### Extension Not Working
- Ensure the SwissSafe backend is running on port 8000
- Check Chrome console for error messages
- Verify the extension has necessary permissions

### API Errors
- Confirm the backend is accessible at `http://localhost:8000`
- Check if the API key is properly set in the backend
- Verify CORS settings allow Chrome extension requests

### Permission Issues
- Go to `chrome://extensions/`
- Click "Details" on SwissSafe extension
- Ensure all required permissions are granted

## Development

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for e-commerce sites
├── icons/                # Extension icons
└── README.md             # This file
```

### Building for Production
1. Update version in `manifest.json`
2. Create optimized icon files
3. Test thoroughly on different sites
4. Package as `.zip` file for Chrome Web Store

## License

This project is part of the SwissSafe application for checking product legality in Switzerland.
