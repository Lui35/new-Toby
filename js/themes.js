class ThemeManager {
    constructor() {
        this.themeSwitch = document.getElementById('theme-switch');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.themeSwitch.addEventListener('click', () => this.toggleTheme());
    }

    async initialize() {
        const theme = await storage.getTheme();
        this.applyTheme(theme);
    }

    async toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        await storage.saveTheme(newTheme);
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const icon = theme === 'light' ? '☀️' : '🌙';
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        // Display only the emoji without additional text
        this.themeSwitch.innerHTML = `${icon}`;
        this.themeSwitch.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    }
}
