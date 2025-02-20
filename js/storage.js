const storage = {
    async saveCollections(collections) {
        await chrome.storage.sync.set({ collections });
    },

    async getCollections() {
        const result = await chrome.storage.sync.get('collections');
        return result.collections || [];
    },

    async saveTheme(theme) {
        await chrome.storage.sync.set({ theme });
    },

    async getTheme() {
        const result = await chrome.storage.sync.get('theme');
        return result.theme || 'light';
    },

    async addCollection(name) {
        const collections = await this.getCollections();
        const newCollection = {
            id: utils.generateId(),
            name,
            cards: []
        };
        collections.push(newCollection);
        await this.saveCollections(collections);
        return newCollection;
    },

    async deleteCollection(collectionId) {
        const collections = await this.getCollections();
        const updatedCollections = collections.filter(c => c.id !== collectionId);
        await this.saveCollections(updatedCollections);
    },

    async addCard(collectionId, card) {
        const collections = await this.getCollections();
        const collection = collections.find(c => c.id === collectionId);
        if (collection) {
            collection.cards.push({
                id: utils.generateId(),
                ...card
            });
            await this.saveCollections(collections);
        }
    },

    async deleteCard(collectionId, cardId) {
        const collections = await this.getCollections();
        const collection = collections.find(c => c.id === collectionId);
        if (collection) {
            collection.cards = collection.cards.filter(c => c.id !== cardId);
            await this.saveCollections(collections);
        }
    },

    async reorderCards(collectionId, cardIds) {
        const collections = await this.getCollections();
        const collection = collections.find(c => c.id === collectionId);
        if (collection) {
            // Create a new array with the cards in the specified order
            const reorderedCards = cardIds.map(cardId => 
                collection.cards.find(card => card.id === cardId)
            ).filter(Boolean);
            
            collection.cards = reorderedCards;
            await this.saveCollections(collections);
        }
    }
};
