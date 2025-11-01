// Utility functions for localStorage and formatting

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format price with currency symbol
function formatPrice(price) {
    return `₹${parseFloat(price).toFixed(2)}`;
}

// Format date
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date for display (YYYY-MM-DD)
function formatDateInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get month string (YYYY-MM)
function getMonthString(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// LocalStorage helpers
const Storage = {
    // Menu items
    getMenuItems() {
        const items = localStorage.getItem('menuItems');
        return items ? JSON.parse(items) : [];
    },

    saveMenuItems(items) {
        localStorage.setItem('menuItems', JSON.stringify(items));
    },

    // Orders
    getOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    },

    saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    },

    addOrder(order) {
        const orders = this.getOrders();
        orders.push(order);
        this.saveOrders(orders);
    },

    // Cart
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    clearCart() {
        localStorage.removeItem('cart');
    }
};

