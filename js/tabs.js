class TabsManager {
    constructor() {
        this.tabsList = document.getElementById('open-tabs-list');
    }

    async initialize() {
        await this.loadOpenTabs();
    }

    async loadOpenTabs() {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        this.renderTabs(tabs);
    }

    renderTabs(tabs) {
        this.tabsList.innerHTML = '';
        tabs.forEach(tab => {
            const tabElement = this.createTabElement(tab);
            this.tabsList.appendChild(tabElement);
        });
    }

    createTabElement(tab) {
        const tabElement = utils.createElementWithClass('div', 'tab-item');
        
        const favicon = utils.createElementWithClass('img', 'tab-favicon');
        favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
        
        const title = utils.createElementWithClass('div', 'tab-title');
        title.textContent = tab.title;
        
        tabElement.appendChild(favicon);
        tabElement.appendChild(title);

        utils.addDragListeners(tabElement, {
            type: 'tab',
            title: tab.title,
            url: tab.url
        });

        return tabElement;
    }
}
