#!/bin/bash

# SwissSafe Chrome Extension Installation Script

echo "🚀 SwissSafe Chrome Extension Setup"
echo "=================================="

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "❌ Chrome browser not found. Please install Chrome first."
    exit 1
fi

echo "✅ Chrome browser found"

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ SwissSafe backend is running"
else
    echo "⚠️  SwissSafe backend is not running on localhost:8000"
    echo "   Please start the backend first:"
    echo "   cd backend && python main.py"
    echo ""
fi

# Create placeholder icons if they don't exist
echo "📁 Creating placeholder icons..."
for size in 16 32 48 128; do
    if [ ! -f "icons/icon${size}.png" ]; then
        # Create a simple colored square as placeholder
        convert -size ${size}x${size} xc:'#10b981' "icons/icon${size}.png" 2>/dev/null || echo "   Note: ImageMagick not available, using SVG icons"
    fi
done

echo ""
echo "📦 Chrome Extension Files Created:"
echo "   ✅ manifest.json"
echo "   ✅ popup.html"
echo "   ✅ popup.css"
echo "   ✅ popup.js"
echo "   ✅ background.js"
echo "   ✅ content.js"
echo "   ✅ README.md"
echo ""

echo "🔧 Installation Instructions:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this chrome-extension folder"
echo "5. Pin the SwissSafe extension for easy access"
echo ""

echo "🎯 Usage:"
echo "• Click the SwissSafe icon in Chrome toolbar"
echo "• Right-click any product link → 'Check with SwissSafe'"
echo "• Visit e-commerce sites to see the floating SwissSafe button"
echo ""

echo "✨ SwissSafe Chrome Extension ready for installation!"
