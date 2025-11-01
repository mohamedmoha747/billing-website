// Menu CRUD operations

// Initialize default menu items if empty
function initializeDefaultMenu() {
    const items = Storage.getMenuItems();
    if (items.length === 0) {
        const defaultItems = [
            {
                id: generateId(),
                name: 'Sundal',
                price: 30,
                description: 'Delicious sundal snack',
                image: 'images/sundal.svg'
            },
            {
                id: generateId(),
                name: 'Bread Omelette',
                price: 40,
                description: 'Fresh bread with omelette',
                image: 'images/bread-omelette.svg'
            },
            {
                id: generateId(),
                name: 'Cutlets',
                price: 35,
                description: 'Crispy vegetable cutlets',
                image: 'images/cutlets.svg'
            },
            {
                id: generateId(),
                name: 'Sandwich',
                price: 50,
                description: 'Fresh sandwich with vegetables',
                image: 'images/sandwich.svg'
            },
            {
                id: generateId(),
                name: 'Other',
                price: 25,
                description: 'Assorted snack',
                image: 'images/other.svg'
            }
        ];
        Storage.saveMenuItems(defaultItems);
    }

    // Ensure existing items have proper images (handle previously-saved data)
    // If an item has a missing image or points to a placeholder, replace it with a local image from the images/ folder if available.
    let updated = false;
    const current = Storage.getMenuItems();
    const placeholderRegex = /placeholder\.com|No\+Image/i;
    for (let i = 0; i < current.length; i++) {
        const it = current[i];
        if (!it.image || placeholderRegex.test(it.image)) {
            // Choose image by name hints
            const name = (it.name || '').toLowerCase();
            if (name.includes('sundal')) {
                it.image = 'images/sundal.svg';
            } else if (name.includes('sandwich')) {
                it.image = 'images/sandwich.svg';
            } else if (name.includes('cutlet') || name.includes('cutlets')) {
                it.image = 'images/cutlets.svg';
            } else if (name.includes('omelette') || name.includes('bread')) {
                it.image = 'images/bread-omelette.svg';
            } else if (name.includes('other')) {
                it.image = 'images/other.svg';
            } else {
                it.image = 'images/other.svg';
            }
            updated = true;
        }
    }

    if (updated) {
        Storage.saveMenuItems(current);
    }
}

// Load and display menu items
function loadMenuItems() {
    const items = Storage.getMenuItems();
    const menuGrid = document.getElementById('menu-grid');
    
    if (!menuGrid) return;

    if (items.length === 0) {
        menuGrid.innerHTML = '<p class="no-items">No menu items. Add some items in Menu Management.</p>';
        return;
    }

    // Render menu items without image (image section removed intentionally)
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <h3>${item.name}</h3>
            <p class="menu-price">${formatPrice(item.price)}</p>
        </div>
    `).join('');

    // Add click event listeners
    menuGrid.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemId = item.dataset.id;
            addToCart(itemId);
        });
    });
}

// Load menu items for management page
function loadMenuItemsForManagement() {
    const items = Storage.getMenuItems();
    const menuGrid = document.getElementById('menu-management-grid');
    
    if (!menuGrid) return;

    if (items.length === 0) {
        menuGrid.innerHTML = '<p class="no-items">No menu items. Add your first item below.</p>';
        return;
    }

    // Render management list without image (image section removed intentionally)
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p class="menu-price">${formatPrice(item.price)}</p>
                <p class="menu-description">${item.description || 'No description'}</p>
            </div>
            <div class="menu-item-actions">
                <button class="btn-edit" onclick="editMenuItem('${item.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteMenuItem('${item.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new menu item
function addMenuItem() {
    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const description = document.getElementById('item-description').value.trim();
    const image = document.getElementById('item-image').value.trim() || 'https://via.placeholder.com/300x200?text=No+Image';

    if (!name || !price || price <= 0) {
        alert('Please enter a valid name and price.');
        return;
    }

    const items = Storage.getMenuItems();
    const newItem = {
        id: generateId(),
        name,
        price,
        description,
        image
    };

    items.push(newItem);
    Storage.saveMenuItems(items);
    
    // Reset form
    document.getElementById('menu-form').reset();
    document.getElementById('form-title').textContent = 'Add Menu Item';
    previewImage(''); // Clear image preview
    
    // Reload menu items
    loadMenuItemsForManagement();
    loadMenuItems(); // Also update main page if available
}

// Edit menu item
function editMenuItem(id) {
    const items = Storage.getMenuItems();
    const item = items.find(i => i.id === id);
    
    if (!item) return;

    // Populate form
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-description').value = item.description;
    document.getElementById('item-image').value = item.image;
    document.getElementById('form-title').textContent = 'Edit Menu Item';
    
    // Show image preview
    previewImage(item.image);
    
    // Store editing ID
    document.getElementById('menu-form').dataset.editingId = id;
    
    // Scroll to form
    document.getElementById('menu-form').scrollIntoView({ behavior: 'smooth' });
}

// Update menu item
function updateMenuItem(id) {
    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const description = document.getElementById('item-description').value.trim();
    const image = document.getElementById('item-image').value.trim() || 'https://via.placeholder.com/300x200?text=No+Image';

    if (!name || !price || price <= 0) {
        alert('Please enter a valid name and price.');
        return;
    }

    const items = Storage.getMenuItems();
    const index = items.findIndex(i => i.id === id);
    
    if (index !== -1) {
        items[index] = {
            ...items[index],
            name,
            price,
            description,
            image
        };
        Storage.saveMenuItems(items);
        
        // Reset form
        document.getElementById('menu-form').reset();
        document.getElementById('form-title').textContent = 'Add Menu Item';
        previewImage(''); // Clear image preview
        delete document.getElementById('menu-form').dataset.editingId;
        
        // Reload menu items
        loadMenuItemsForManagement();
        loadMenuItems();
    }
}

// Delete menu item
function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const items = Storage.getMenuItems();
    const filtered = items.filter(i => i.id !== id);
    Storage.saveMenuItems(filtered);
    
    loadMenuItemsForManagement();
    loadMenuItems();
}

// Preview image from URL
function previewImage(url) {
    const previewDiv = document.getElementById('image-preview');
    if (!previewDiv) return;

    if (!url || url.trim() === '') {
        previewDiv.classList.remove('show');
        previewDiv.innerHTML = '';
        return;
    }

    previewDiv.classList.add('show');
    previewDiv.innerHTML = '<p style="color: #666; font-size: 0.9rem;">Loading preview...</p>';

    const img = new Image();
    img.onload = function() {
        previewDiv.innerHTML = `
            <label style="display: block; margin-bottom: 0.5rem; color: #666; font-size: 0.9rem;">Preview:</label>
            <img src="${url}" alt="Image preview" onerror="this.parentElement.innerHTML='<div class=\'preview-error\'>Unable to load image. Please check the URL.</div>'">
        `;
    };
    img.onerror = function() {
        previewDiv.innerHTML = '<div class="preview-error">Unable to load image. Please check the URL.</div>';
    };
    img.src = url;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultMenu();
    
    // Load menu items if on main page
    if (document.getElementById('menu-grid')) {
        loadMenuItems();
    }
    
    // Load menu items for management if on management page
    if (document.getElementById('menu-management-grid')) {
        loadMenuItemsForManagement();
        
        // Handle form submission
        const form = document.getElementById('menu-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const editingId = form.dataset.editingId;
                if (editingId) {
                    updateMenuItem(editingId);
                } else {
                    addMenuItem();
                }
            });
        }

        // Clear image preview when form is reset
        const imageInput = document.getElementById('item-image');
        if (imageInput) {
            imageInput.addEventListener('input', function() {
                previewImage(this.value);
            });
        }
    }
});

