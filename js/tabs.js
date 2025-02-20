class TabsManager {
    constructor() {
        this.tabsList = document.getElementById('open-tabs-list');
        this.setupRefreshButton();
    }

    setupRefreshButton() {
        const refreshContainer = document.createElement('div');
        refreshContainer.className = 'refresh-container';
        
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'refresh-btn';
        refreshBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
        `;
        refreshBtn.title = 'Refresh Tabs';
        refreshBtn.onclick = () => this.refreshTabs();
        
        refreshContainer.appendChild(refreshBtn);
        const tabsHeader = document.querySelector('.tabs-header') || this.tabsList.parentNode;
        tabsHeader.insertBefore(refreshContainer, tabsHeader.firstChild);
    }

    async refreshTabs() {
        const refreshBtn = document.querySelector('.refresh-btn');
        refreshBtn.classList.add('spinning');
        
        try {
            const tabs = await chrome.tabs.query({ currentWindow: true });
            this.renderTabs(tabs);
        } catch (error) {
            console.error('Error refreshing tabs:', error);
        }
        
        setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
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
        tabElement.draggable = true;
        
        const favicon = utils.createElementWithClass('img', 'tab-favicon');
        favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
        favicon.onerror = () => favicon.src = 'icons/default-favicon.png';
        
        const title = utils.createElementWithClass('div', 'tab-title');
        title.textContent = tab.title;
        title.title = tab.title;
        
        const closeBtn = utils.createElementWithClass('button', 'tab-close-btn');
        closeBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
            </svg>
        `;
        closeBtn.onclick = async (e) => {
            e.stopPropagation();
            try {
                await chrome.tabs.remove(tab.id);
                tabElement.remove();
            } catch (error) {
                console.error('Error closing tab:', error);
            }
        };
        
        tabElement.appendChild(favicon);
        tabElement.appendChild(title);
        tabElement.appendChild(closeBtn);
        
        tabElement.onclick = () => {
            chrome.tabs.update(tab.id, { active: true });
            chrome.windows.update(tab.windowId, { focused: true });
        };
        
        utils.addDragListeners(tabElement, {
            type: 'tab',
            id: tab.id,
            title: tab.title,
            url: tab.url,
            favicon: tab.favIconUrl
        });
        
        return tabElement;
    }
}
