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
        this.themeSwitch.textContent = `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`;
    }
}
