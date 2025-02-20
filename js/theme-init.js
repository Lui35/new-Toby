// Prevent flash of wrong theme by running this first
try {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    // Add a class to indicate theme is loaded
    document.documentElement.classList.add('theme-loaded');
    chrome.storage.sync.get('theme', (result) => {
        if (result.theme && result.theme !== savedTheme) {
            document.documentElement.setAttribute('data-theme', result.theme);
            document.documentElement.classList.add('theme-loaded');
            localStorage.setItem('theme', result.theme);
        }
    });
} catch (e) {
    console.error('Error setting initial theme:', e);
    // Fallback to light theme if there's an error
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('theme-loaded');
}
