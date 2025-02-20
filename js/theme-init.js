// Prevent flash of wrong theme by running this first
try {
    chrome.storage.sync.get('theme', (result) => {
        const savedTheme = result.theme || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Add a class to indicate theme is loaded
        document.documentElement.classList.add('theme-loaded');
    });
} catch (e) {
    console.error('Error setting initial theme:', e);
    // Fallback to light theme if there's an error
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('theme-loaded');
}
