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
        const title = utils.createElementWithClass('h3', 'collection-title');
        title.textContent = collection.name;
        title.contentEditable = true;
        
        const deleteBtn = utils.createElementWithClass('button', 'delete-btn');
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => this.deleteCollection(collection.id);
        
        header.appendChild(title);
        header.appendChild(deleteBtn);
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

        this.collectionsContainer.appendChild(collectionElement);
    }

    createCardElement(card, collectionId) {
        const cardElement = utils.createElementWithClass('div', 'web-card');
        
        const cardContent = utils.createElementWithClass('div', 'card-content');
        cardContent.onclick = () => window.open(card.url, '_blank');
        
        const cardHeader = utils.createElementWithClass('div', 'card-header');
        
        const favicon = utils.createElementWithClass('img', 'card-favicon');
        favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(card.url).hostname}&sz=32`;
        favicon.onerror = () => favicon.src = 'icons/default-favicon.png';
        
        const cardTitle = utils.createElementWithClass('div', 'card-title');
        cardTitle.textContent = card.title;
        
        const cardUrl = utils.createElementWithClass('div', 'card-url');
        cardUrl.textContent = new URL(card.url).hostname;
        
        const deleteBtn = utils.createElementWithClass('button', 'delete-btn');
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteCard(collectionId, card.id);
        };
        
        cardHeader.appendChild(favicon);
        cardHeader.appendChild(cardTitle);
        cardContent.appendChild(cardHeader);
        cardContent.appendChild(cardUrl);
        cardElement.appendChild(cardContent);
        cardElement.appendChild(deleteBtn);
        
        utils.addDragListeners(cardElement, {
            type: 'card',
            id: card.id,
            collectionId: collectionId
        });
        
        return cardElement;
    }

    async deleteCollection(collectionId) {
        if (confirm('Are you sure you want to delete this collection?')) {
            await storage.deleteCollection(collectionId);
            const collections = await storage.getCollections();
            this.renderCollections(collections);
        }
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
