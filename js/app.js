document.addEventListener('DOMContentLoaded', async () => {
    const themeManager = new ThemeManager();
    const collectionsManager = new CollectionsManager();
    const tabsManager = new TabsManager();

    await Promise.all([
        themeManager.initialize(),
        collectionsManager.initialize(),
        tabsManager.initialize()
    ]);
});
