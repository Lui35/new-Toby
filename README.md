# New Toby - Chrome Extension

A Chrome extension for efficient tab management, inspired by Toby. This extension allows you to organize your tabs into collections with a clean and modern interface.

## Features

- Create and manage collections of web pages
- Drag and drop tabs from the sidebar into collections
- Edit collection and bookmark names
- Dark and light theme support
- Clean, modern UI with smooth animations

## Project Structure

```
new-toby/
├── manifest.json        # Chrome extension configuration
├── popup.html          # Main extension popup
├── styles/
│   ├── main.css       # Main styles
│   └── themes.css     # Theme-specific styles
├── js/
│   ├── app.js         # Main application initialization
│   ├── collections.js # Collections management
│   ├── storage.js     # Chrome storage operations
│   ├── tabs.js        # Open tabs management
│   ├── themes.js      # Theme switching functionality
│   └── utils.js       # Utility functions
└── icons/             # Extension icons (you need to add these)

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in Chrome to open the popup
2. Create new collections using the "New Collection" button
3. Drag open tabs from the sidebar into your collections
4. Edit collection and bookmark names by clicking on them
5. Toggle between light and dark themes using the theme switch button

## Development

The extension is built with vanilla JavaScript and uses Chrome's Storage API for data persistence. The code is organized into modules for better maintainability:

- `collections.js`: Manages the creation and organization of collections
- `storage.js`: Handles all Chrome storage operations
- `tabs.js`: Manages the open tabs sidebar
- `themes.js`: Handles theme switching
- `utils.js`: Contains utility functions used throughout the extension
