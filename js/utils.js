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
    },

    showAlert: (options) => {
        const { title, message, type = 'confirm', onConfirm, onCancel } = options;
        
        const alert = document.createElement('div');
        alert.className = 'custom-alert';
        
        const alertContent = document.createElement('div');
        alertContent.className = 'alert-content';
        
        const alertHeader = document.createElement('div');
        alertHeader.className = 'alert-header';
        
        const alertTitle = document.createElement('h3');
        alertTitle.className = 'alert-title';
        alertTitle.textContent = title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'alert-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            alert.classList.add('closing');
            setTimeout(() => document.body.removeChild(alert), 300);
            if (onCancel) onCancel();
        };
        
        alertHeader.appendChild(alertTitle);
        alertHeader.appendChild(closeBtn);
        
        const alertMessage = document.createElement('div');
        alertMessage.className = 'alert-message';
        alertMessage.textContent = message;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';
        
        if (type === 'confirm') {
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'btn-secondary';
            cancelBtn.onclick = () => {
                alert.classList.add('closing');
                setTimeout(() => document.body.removeChild(alert), 300);
                if (onCancel) onCancel();
            };
            buttonContainer.appendChild(cancelBtn);
        }
        
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = type === 'confirm' ? 'Confirm' : 'OK';
        confirmBtn.className = 'btn-primary';
        confirmBtn.onclick = () => {
            alert.classList.add('closing');
            setTimeout(() => document.body.removeChild(alert), 300);
            if (onConfirm) onConfirm();
        };
        buttonContainer.appendChild(confirmBtn);
        
        alertContent.appendChild(alertHeader);
        alertContent.appendChild(alertMessage);
        alertContent.appendChild(buttonContainer);
        alert.appendChild(alertContent);
        
        document.body.appendChild(alert);
        setTimeout(() => alert.classList.add('show'), 50);
        
        confirmBtn.focus();
    }
};
