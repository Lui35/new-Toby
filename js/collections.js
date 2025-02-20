class CollectionsManager {
    constructor() {
        this.collectionsContainer = document.getElementById('collections-list');
        this.addCollectionButton = document.getElementById('add-collection');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addCollectionButton.addEventListener('click', () => this.createNewCollection());
    }

    async initialize() {
        const collections = await storage.getCollections();
        this.renderCollections(collections);
    }

    async createNewCollection() {
        const name = prompt('Enter collection name:');
        if (name) {
            const newCollection = await storage.addCollection(name);
            this.renderCollection(newCollection);
        }
    }

    renderCollections(collections) {
        this.collectionsContainer.innerHTML = '';
        collections.forEach(collection => this.renderCollection(collection));
    }

    renderCollection(collection) {
        const collectionElement = utils.createElementWithClass('div', 'collection-card');
        
        const header = utils.createElementWithClass('div', 'collection-header');
        
        const titleContainer = utils.createElementWithClass('div', 'collection-title-container');
        const title = utils.createElementWithClass('h3', 'collection-title');
        title.textContent = collection.name;
        
        const menuContainer = utils.createElementWithClass('div', 'collection-menu-container');
        const menuBtn = utils.createElementWithClass('button', 'menu-btn');
        menuBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
            </svg>
        `;
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        };

        const dropdown = utils.createElementWithClass('div', 'dropdown-menu');
        
        // Edit button
        const editBtn = utils.createElementWithClass('button', 'dropdown-item');
        editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            this.showEditCollectionModal(collection);
        };
        
        // Delete button
        const deleteBtn = utils.createElementWithClass('button', 'dropdown-item');
        deleteBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteCollection(collection.id);
        };
        
        dropdown.appendChild(editBtn);
        dropdown.appendChild(deleteBtn);
        menuContainer.appendChild(menuBtn);
        menuContainer.appendChild(dropdown);
        
        titleContainer.appendChild(title);
        header.appendChild(titleContainer);
        header.appendChild(menuContainer);
        collectionElement.appendChild(header);

        const cardsContainer = utils.createElementWithClass('div', 'cards-container');
        collection.cards.forEach(card => {
            const cardElement = this.createCardElement(card, collection.id);
            cardsContainer.appendChild(cardElement);
        });

        collectionElement.appendChild(cardsContainer);

        utils.addDropListeners(collectionElement, (data) => {
            if (data.type === 'tab') {
                this.addCardToCollection(collection.id, data);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuContainer.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        this.collectionsContainer.appendChild(collectionElement);
    }

    createCardElement(card, collectionId) {
        const cardElement = utils.createElementWithClass('div', 'web-card');
        cardElement.dataset.cardId = card.id;
        
        const cardContent = utils.createElementWithClass('div', 'card-content');
        
        const cardHeader = utils.createElementWithClass('div', 'card-header');
        
        const favicon = utils.createElementWithClass('img', 'card-favicon');
        favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(card.url).hostname}&sz=32`;
        favicon.onerror = () => favicon.src = 'icons/default-favicon.png';
        
        const cardTitle = utils.createElementWithClass('div', 'card-title');
        cardTitle.textContent = card.title;
        
        cardHeader.appendChild(favicon);
        cardHeader.appendChild(cardTitle);
        
        const cardUrl = utils.createElementWithClass('div', 'card-url');
        cardUrl.textContent = new URL(card.url).hostname;
        
        cardContent.appendChild(cardHeader);
        cardContent.appendChild(cardUrl);
        
        // Create menu container with move and menu buttons
        const menuContainer = utils.createElementWithClass('div', 'card-menu-container');
        
        // Move button
        const moveBtn = utils.createElementWithClass('button', 'move-btn');
        moveBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 9l7-7 7 7"/>
                <path d="M5 15l7 7 7-7"/>
            </svg>
        `;
        moveBtn.onclick = (e) => {
            e.stopPropagation();
            const cardsContainer = cardElement.closest('.cards-container');
            cardReorderer.selectCard(cardElement, cardsContainer);
        };
        
        // Menu button
        const menuBtn = utils.createElementWithClass('button', 'menu-btn');
        menuBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
            </svg>
        `;
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        };

        const dropdown = utils.createElementWithClass('div', 'dropdown-menu');
        
        // Edit button
        const editBtn = utils.createElementWithClass('button', 'dropdown-item');
        editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            this.showEditModal(card, collectionId);
        };
        
        // Delete button
        const deleteBtn = utils.createElementWithClass('button', 'dropdown-item');
        deleteBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            utils.showAlert({
                title: 'Delete Card',
                message: 'Are you sure you want to delete this card?',
                type: 'confirm',
                onConfirm: () => this.deleteCard(collectionId, card.id)
            });
        };
        
        dropdown.appendChild(editBtn);
        dropdown.appendChild(deleteBtn);
        menuContainer.appendChild(moveBtn);
        menuContainer.appendChild(menuBtn);
        menuContainer.appendChild(dropdown);
        
        cardElement.appendChild(cardContent);
        cardElement.appendChild(menuContainer);
        
        cardElement.onclick = () => {
            chrome.tabs.create({ url: card.url });
        };
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuContainer.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        utils.addDragListeners(cardElement, {
            type: 'card',
            id: card.id,
            collectionId: collectionId
        });
        
        return cardElement;
    }

    async showEditModal(card, collectionId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add('closing');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        };

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Edit Card';
        modalTitle.className = 'modal-title';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modal.classList.add('closing');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);

        const form = document.createElement('form');
        form.className = 'modal-form';
        form.onsubmit = (e) => e.preventDefault();

        const titleLabel = document.createElement('label');
        titleLabel.textContent = 'Title';
        titleLabel.htmlFor = 'card-title';

        const title = document.createElement('input');
        title.type = 'text';
        title.id = 'card-title';
        title.value = card.title;
        title.placeholder = 'Enter card title';
        title.className = 'modal-input';

        const urlLabel = document.createElement('label');
        urlLabel.textContent = 'URL';
        urlLabel.htmlFor = 'card-url';

        const url = document.createElement('input');
        url.type = 'url';
        url.id = 'card-url';
        url.value = card.url;
        url.placeholder = 'Enter URL';
        url.className = 'modal-input';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn-secondary';
        cancelBtn.onclick = () => {
            modal.classList.add('closing');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.className = 'btn-primary';
        saveBtn.onclick = async () => {
            if (url.value && title.value) {
                const collections = await storage.getCollections();
                const collection = collections.find(c => c.id === collectionId);
                if (collection) {
                    const cardIndex = collection.cards.findIndex(c => c.id === card.id);
                    if (cardIndex !== -1) {
                        collection.cards[cardIndex] = {
                            ...collection.cards[cardIndex],
                            title: title.value,
                            url: url.value
                        };
                        await storage.saveCollections(collections);
                        this.renderCollections(collections);
                        modal.classList.add('closing');
                        setTimeout(() => document.body.removeChild(modal), 300);
                    }
                }
            }
        };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);

        form.appendChild(titleLabel);
        form.appendChild(title);
        form.appendChild(urlLabel);
        form.appendChild(url);
        form.appendChild(buttonContainer);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(form);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 50);
        title.focus();
    }

    async showEditCollectionModal(collection) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add('closing');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        };

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Edit Collection';
        modalTitle.className = 'modal-title';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modal.classList.add('closing');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);

        const form = document.createElement('form');
        form.className = 'modal-form';
        form.onsubmit = (e) => e.preventDefault();

        const titleLabel = document.createElement('label');
        titleLabel.textContent = 'Collection Name';
        titleLabel.htmlFor = 'collection-name';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'collection-name';
        titleInput.value = collection.name;
        titleInput.placeholder = 'Enter collection name';
        titleInput.className = 'modal-input';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn-secondary';
        cancelBtn.onclick = () => {
            modal.classList.add('closing');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.className = 'btn-primary';
        saveBtn.onclick = async () => {
            if (titleInput.value.trim()) {
                const collections = await storage.getCollections();
                const collectionIndex = collections.findIndex(c => c.id === collection.id);
                if (collectionIndex !== -1) {
                    collections[collectionIndex].name = titleInput.value.trim();
                    await storage.saveCollections(collections);
                    this.renderCollections(collections);
                    modal.classList.add('closing');
                    setTimeout(() => document.body.removeChild(modal), 300);
                }
            }
        };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);

        form.appendChild(titleLabel);
        form.appendChild(titleInput);
        form.appendChild(buttonContainer);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(form);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 50);
        titleInput.focus();
    }

    async deleteCollection(collectionId) {
        utils.showAlert({
            title: 'Delete Collection',
            message: 'Are you sure you want to delete this collection? This action cannot be undone.',
            type: 'confirm',
            onConfirm: async () => {
                await storage.deleteCollection(collectionId);
                const collections = await storage.getCollections();
                this.renderCollections(collections);
            }
        });
    }

    async deleteCard(collectionId, cardId) {
        await storage.deleteCard(collectionId, cardId);
        const collections = await storage.getCollections();
        this.renderCollections(collections);
    }

    async addCardToCollection(collectionId, cardData) {
        await storage.addCard(collectionId, {
            title: cardData.title,
            url: cardData.url
        });
        const collections = await storage.getCollections();
        this.renderCollections(collections);
    }
}
