#!/usr/bin/env node

// Chrome Extension Validation Script
const fs = require('fs');
const path = require('path');

console.log('🔍 SwissSafe Chrome Extension Validation');
console.log('=====================================');

const requiredFiles = [
  'manifest.json',
  'popup.html',
  'popup.css',
  'popup.js',
  'background.js',
  'content.js',
  'README.md'
];

const requiredIcons = [
  'icons/icon16.png',
  'icons/icon32.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

let allValid = true;

// Check required files
console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allValid = false;
  }
});

// Check manifest.json
console.log('\n📋 Validating manifest.json:');
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  
  if (manifest.manifest_version === 3) {
    console.log('  ✅ Manifest version 3');
  } else {
    console.log('  ❌ Manifest version should be 3');
    allValid = false;
  }
  
  if (manifest.name && manifest.name.includes('SwissSafe')) {
    console.log('  ✅ Extension name includes SwissSafe');
  } else {
    console.log('  ❌ Extension name should include SwissSafe');
    allValid = false;
  }
  
  if (manifest.permissions && manifest.permissions.includes('activeTab')) {
    console.log('  ✅ Has activeTab permission');
  } else {
    console.log('  ❌ Missing activeTab permission');
    allValid = false;
  }
  
} catch (error) {
  console.log('  ❌ Invalid JSON in manifest.json');
  allValid = false;
}

// Check icons
console.log('\n🎨 Checking icons:');
requiredIcons.forEach(icon => {
  if (fs.existsSync(icon)) {
    console.log(`  ✅ ${icon}`);
  } else {
    console.log(`  ⚠️  ${icon} - Using placeholder`);
  }
});

// Check popup files
console.log('\n🖥️  Checking popup files:');
if (fs.existsSync('popup.html')) {
  const popupContent = fs.readFileSync('popup.html', 'utf8');
  if (popupContent.includes('SwissSafe')) {
    console.log('  ✅ popup.html contains SwissSafe branding');
  } else {
    console.log('  ⚠️  popup.html missing SwissSafe branding');
  }
}

if (fs.existsSync('popup.js')) {
  const popupJs = fs.readFileSync('popup.js', 'utf8');
  if (popupJs.includes('localhost:8000')) {
    console.log('  ✅ popup.js configured for localhost:8000');
  } else {
    console.log('  ⚠️  popup.js may not be configured for correct API endpoint');
  }
}

// Summary
console.log('\n📊 Validation Summary:');
if (allValid) {
  console.log('  ✅ All required files present and valid');
  console.log('  🚀 Extension is ready for installation!');
  console.log('\n📖 Next steps:');
  console.log('  1. Start SwissSafe backend: cd ../backend && python main.py');
  console.log('  2. Open Chrome and go to chrome://extensions/');
  console.log('  3. Enable Developer mode');
  console.log('  4. Click "Load unpacked" and select this folder');
} else {
  console.log('  ❌ Some issues found. Please fix them before installation.');
}

console.log('\n✨ Validation complete!');
