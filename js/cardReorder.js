class CardReorderer {
    constructor() {
        this.selectedCard = null;
        this.selectedCollection = null;
        this.setupGlobalListeners();
    }

    setupGlobalListeners() {
        // Listen for keyboard events when a card is selected
        document.addEventListener('keydown', (e) => {
            if (this.selectedCard) {
                this.handleKeyPress(e);
            }
        });

        // Listen for clicks outside to deselect
        document.addEventListener('click', (e) => {
            if (this.selectedCard && !e.target.closest('.web-card') && !e.target.closest('.move-btn')) {
                this.deselectCard();
            }
        });
    }

    handleKeyPress(e) {
        if (!this.selectedCard || !this.selectedCollection) return;

        const cards = Array.from(this.selectedCollection.querySelectorAll('.web-card'));
        const currentIndex = cards.indexOf(this.selectedCard);
        let newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    newIndex = currentIndex - 1;
                    e.preventDefault(); // Prevent page scroll
                }
                break;
            case 'ArrowRight':
                if (currentIndex < cards.length - 1) {
                    newIndex = currentIndex + 1;
                    e.preventDefault(); // Prevent page scroll
                }
                break;
        }

        if (newIndex !== currentIndex) {
            this.moveCard(currentIndex, newIndex);
        }
    }

    selectCard(card, collection) {
        // If clicking the same card, deselect it
        if (this.selectedCard === card) {
            this.deselectCard();
            return;
        }

        // Deselect previous card if exists
        if (this.selectedCard) {
            this.selectedCard.classList.remove('selected-for-move');
        }

        this.selectedCard = card;
        this.selectedCollection = collection;
        card.classList.add('selected-for-move');
    }

    deselectCard() {
        if (this.selectedCard) {
            this.selectedCard.classList.remove('selected-for-move');
            this.selectedCard = null;
            this.selectedCollection = null;
        }
    }

    async moveCard(fromIndex, toIndex) {
        const cards = Array.from(this.selectedCollection.querySelectorAll('.web-card'));
        const collectionId = this.selectedCollection.closest('.collection-card').dataset.collectionId;
        
        // Move the DOM element
        const cardElement = cards[fromIndex];
        const cardsContainer = this.selectedCollection;
        
        if (fromIndex < toIndex) {
            if (cards[toIndex + 1]) {
                cardsContainer.insertBefore(cardElement, cards[toIndex + 1]);
            } else {
                cardsContainer.appendChild(cardElement);
            }
        } else {
            cardsContainer.insertBefore(cardElement, cards[toIndex]);
        }

        // Update the storage
        const cardIds = Array.from(cardsContainer.querySelectorAll('.web-card')).map(card => card.dataset.cardId);
        await storage.reorderCards(collectionId, cardIds);

        // Keep the card selected after moving
        cardElement.classList.add('selected-for-move');
    }
}

// Initialize the card reorderer
const cardReorderer = new CardReorderer();
