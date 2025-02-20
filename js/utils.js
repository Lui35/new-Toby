const utils = {
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    createElementWithClass: (tag, className) => {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        return element;
    },

    addDragListeners: (element, data) => {
        element.setAttribute('draggable', true);
        
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(data));
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
        });
    },

    addDropListeners: (element, onDrop) => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('drag-over');
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            onDrop(data);
        });
    }
};
