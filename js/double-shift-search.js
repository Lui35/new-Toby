// Fuzzy search implementation
function fuzzySearch(searchStr, targetStr) {
    searchStr = searchStr.toLowerCase();
    targetStr = targetStr.toLowerCase();
    
    let searchIndex = 0;
    for (let i = 0; i < targetStr.length && searchIndex < searchStr.length; i++) {
        if (searchStr[searchIndex] === targetStr[i]) {
            searchIndex++;
        }
    }
    
    return searchIndex === searchStr.length;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Double shift detection and search functionality
class DoubleShiftSearch {
    constructor() {
        this.lastShiftPress = 0;
        this.searchPopup = null;
        this.searchInput = null;
        this.resultsContainer = null;
        this.isPopupOpen = false;
        this.DOUBLE_PRESS_DELAY = 500; // ms
        this.selectedIndex = -1;
        this.currentResults = [];
        
        this.init();
    }
    
    init() {
        this.createSearchPopup();
        this.debouncedPerformSearch = debounce(this.performSearch.bind(this), 300);
        this.setupEventListeners();
    }
    
    createSearchPopup() {
        // Create popup elements
        this.searchPopup = document.createElement('div');
        this.searchPopup.className = 'search-popup';
        this.searchPopup.style.display = 'none';
        
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper';
        
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Search cards...';
        this.searchInput.className = 'search-input';
        
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'search-results';
        
        searchWrapper.appendChild(this.searchInput);
        this.searchPopup.appendChild(searchWrapper);
        this.searchPopup.appendChild(this.resultsContainer);
        
        document.body.appendChild(this.searchPopup);
    }
    
    setupEventListeners() {
        // Handle shift key detection
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                const currentTime = Date.now();
                if (currentTime - this.lastShiftPress <= this.DOUBLE_PRESS_DELAY) {
                    this.openSearchPopup();
                }
                this.lastShiftPress = currentTime;
            }
        });
        
        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectNextResult();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectPreviousResult();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.openSelectedCard();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeSearchPopup();
                    break;
            }
        });
        
        // Handle search input with debounce
        this.searchInput.addEventListener('input', () => {
            this.selectedIndex = -1; // Reset selection on new search
            this.debouncedPerformSearch();
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isPopupOpen && !this.searchPopup.contains(e.target)) {
                this.closeSearchPopup();
            }
        });
    }
    
    selectNextResult() {
        if (this.currentResults.length > 0) {
            this.selectedIndex = (this.selectedIndex + 1) % this.currentResults.length;
            this.updateSelection();
        }
    }
    
    selectPreviousResult() {
        if (this.currentResults.length > 0) {
            this.selectedIndex = this.selectedIndex <= 0 ? 
                this.currentResults.length - 1 : 
                this.selectedIndex - 1;
            this.updateSelection();
        }
    }
    
    updateSelection() {
        const items = this.resultsContainer.querySelectorAll('.result-card-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    openSelectedCard() {
        if (this.currentResults.length === 0) {
            return;
        }
        if (this.selectedIndex === -1) {
            this.selectedIndex = 0;
        }
        if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
            const selectedCard = this.currentResults[this.selectedIndex];
            window.open(selectedCard.url, '_blank');
            this.closeSearchPopup();
        }
    }
    
    openSearchPopup() {
        this.isPopupOpen = true;
        this.searchPopup.style.display = 'block';
        this.searchInput.value = '';
        this.searchInput.focus();
        this.selectedIndex = -1;
        this.currentResults = [];
        this.performSearch();
    }
    
    closeSearchPopup() {
        this.isPopupOpen = false;
        this.searchPopup.style.display = 'none';
        this.selectedIndex = -1;
        this.currentResults = [];
    }
    
    async performSearch() {
        const searchTerm = this.searchInput.value.trim();
        this.resultsContainer.innerHTML = '';
        
        if (searchTerm === '') {
            this.currentResults = [];
            return;
        }
        
        try {
            const collections = await storage.getCollections();
            this.currentResults = [];
            
            // Search through all cards in all collections
            collections.forEach(collection => {
                collection.cards.forEach(card => {
                    if (fuzzySearch(searchTerm, card.title)) {
                        this.currentResults.push(card);
                    }
                });
            });
            
            this.displayResults();
        } catch (error) {
            console.error('Error searching cards:', error);
        }
    }
    
    displayResults() {
        this.resultsContainer.innerHTML = '';
        if(this.currentResults.length > 0 && this.selectedIndex < 0) {
            this.selectedIndex = 0;
        }
        
        if (this.currentResults.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No cards found';
            this.resultsContainer.appendChild(noResults);
            return;
        }
        
        this.currentResults.forEach((card, index) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'result-card-item';
            if (index === this.selectedIndex) {
                cardItem.classList.add('selected');
            }
            
            cardItem.innerHTML = `
                <div class="result-card-title">${card.title || 'Untitled'}</div>
                <div class="result-card-url">${card.url}</div>
            `;
            
            cardItem.addEventListener('click', () => {
                window.open(card.url, '_blank');
                this.closeSearchPopup();
            });
            
            cardItem.addEventListener('mouseover', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
            
            this.resultsContainer.appendChild(cardItem);
        });
    }
}

// Initialize the double shift search functionality
const doubleShiftSearch = new DoubleShiftSearch();
