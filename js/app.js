// Main billing logic and cart functionality

// Add item to cart
function addToCart(itemId) {
    const items = Storage.getMenuItems();
    const item = items.find(i => i.id === itemId);
    
    if (!item) return;

    let cart = Storage.getCart();
    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    Storage.saveCart(cart);
    updateCartDisplay();
    
    // Show notification
    showNotification(`${item.name} added to cart`);
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = Storage.getCart();
    cart = cart.filter(i => i.id !== itemId);
    Storage.saveCart(cart);
    updateCartDisplay();
}

// Update item quantity in cart
function updateQuantity(itemId, change) {
    let cart = Storage.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        Storage.saveCart(cart);
        updateCartDisplay();
    }
}

// Clear cart
function clearCart() {
    if (Storage.getCart().length === 0) {
        showNotification('Cart is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear the cart?')) {
        Storage.clearCart();
        updateCartDisplay();
        showNotification('Cart cleared');
    }
}

// Update cart display
function updateCartDisplay() {
    const cart = Storage.getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = formatPrice(0);
        if (cartCount) cartCount.textContent = '0';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} × ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="btn-remove" onclick="removeFromCart('${item.id}')">×</button>
            </div>
            <div class="cart-item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>
        </div>
    `).join('');

    if (cartTotal) cartTotal.textContent = formatPrice(total);
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0).toString();
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Pay Now - Show QR Code and UPI link
function payNow() {
    const cart = Storage.getCart();
    
    if (cart.length === 0) {
        alert('Your cart is empty. Add items to cart first.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Your UPI ID (from user)
    // const UPI_ID = 'mohamedharun76982368@oksbi';
const UPI_ID = 'ahamedofficial989@okaxis';


    // Build UPI deep-link (many mobile UPI apps will handle this)
    const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('Restaurant')}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order payment')}`;

    // Create payment modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'payment-modal';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closePaymentModal()">&times;</span>
            <h2>Payment</h2>
            <div class="payment-summary">
                <p><strong>Total Amount:</strong> ${formatPrice(total)}</p>
                <p><strong>Items:</strong> ${cart.length}</p>
            </div>
            <div class="upi-block">
                <p><strong>UPI ID:</strong> <span id="upi-id">${UPI_ID}</span>
                <button id="copy-upi" class="btn btn-secondary">Copy UPI</button></p>
                <p>Open in mobile UPI app: <a id="upi-link" href="${upiLink}">Pay via UPI</a></p>
            </div>
            <div id="qrcode"></div>
            <p class="qr-note">Scan the QR code with your UPI app to pay</p>
            <div class="payment-actions">
                <button class="btn-secondary" onclick="closePaymentModal()">Cancel</button>
                <button class="btn-primary" onclick="confirmPayment()">Confirm Payment</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Attach copy handler
    const copyHandler = () => {
        const upiText = UPI_ID;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(upiText).then(() => {
                showNotification('UPI ID copied to clipboard');
            }).catch(() => {
                alert('Copy failed. UPI ID: ' + upiText);
            });
        } else {
            // Fallback
            const el = document.createElement('textarea');
            el.value = upiText;
            document.body.appendChild(el);
            el.select();
            try {
                document.execCommand('copy');
                showNotification('UPI ID copied to clipboard');
            } catch (e) {
                alert('Copy failed. UPI ID: ' + upiText);
            }
            el.remove();
        }
    };

    // Generate QR code from UPI deep link
    if (typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById('qrcode'), {
            text: upiLink,
            width: 200,
            height: 200
        });
    } else {
        document.getElementById('qrcode').innerHTML = '<p>QR Code library not loaded</p>';
    }

    // Wire copy button after DOM insertion
    setTimeout(() => {
        const copyBtn = document.getElementById('copy-upi');
        if (copyBtn) copyBtn.addEventListener('click', copyHandler);
    }, 0);

    modal.style.display = 'flex';
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Confirm payment
function confirmPayment() {
    const cart = Storage.getCart();
    
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const order = {
        id: generateId(),
        date: new Date().toISOString(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total
    };

    // Save order
    Storage.addOrder(order);
    
    // Clear cart
    Storage.clearCart();
    updateCartDisplay();
    
    // Close modal
    closePaymentModal();
    
    showNotification('Payment confirmed! Order saved.');
}

// Print bill
function printBill() {
    const cart = Storage.getCart();
    
    if (cart.length === 0) {
        alert('Your cart is empty. Add items to cart first.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date();
    
    // Create printable bill content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill - Restaurant</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 400px;
                    margin: 0 auto;
                }
                .bill-header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .bill-header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .bill-info {
                    margin-bottom: 20px;
                }
                .bill-items {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .bill-items th,
                .bill-items td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .bill-items th {
                    background-color: #f4f4f4;
                }
                .bill-total {
                    text-align: right;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px solid #000;
                }
                .bill-footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="bill-header">
                <h1>RESTAURANT</h1>
                <p>Thank you for your visit!</p>
            </div>
            <div class="bill-info">
                <p><strong>Date:</strong> ${formatDate(now)}</p>
                <p><strong>Bill No:</strong> ${generateId().substr(0, 8).toUpperCase()}</p>
            </div>
            <table class="bill-items">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${formatPrice(item.price)}</td>
                            <td>${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="bill-total">
                <p>Total: ${formatPrice(total)}</p>
            </div>
            <div class="bill-footer">
                <p>Thank you! Visit again!</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('payment-modal');
        if (e.target === modal) {
            closePaymentModal();
        }
    });
});

