# Restaurant Billing Website

A simple, client-side restaurant billing system built with HTML, CSS, and JavaScript. No backend required - all data is stored in browser's localStorage.

## Features

- **Menu Management**: Full CRUD operations for menu items
- **Billing System**: Add items to cart with a single click
- **Cart Management**: Adjust quantities, remove items, clear cart
- **QR Code Payment**: Generate QR code for payment processing
- **Bill Printing**: Print formatted receipts
- **Monthly Sales Report**: View sales statistics by month

## Getting Started

1. Simply open `index.html` in your web browser
2. No installation or server setup required
3. Works offline after initial load

## Pages

### 1. Billing (`index.html`)
- Main interface for taking orders
- Click on menu items to add them to cart
- View cart, adjust quantities, print bill, or process payment

### 2. Menu Management (`menu-management.html`)
- Add new menu items (name, price, description, image)
- Edit existing items
- Delete items
- Default items: Sundal, Bread Omelette, Cutlets, Sandwich

### 3. Sales Report (`sales-report.html`)
- View monthly sales statistics
- Total sales, number of orders, average order value
- Daily breakdown and top selling items

## Usage

### Adding Items to Cart
- Click on any menu item from the menu grid
- Item is automatically added to cart
- Click again to increase quantity

### Managing Cart
- Use +/- buttons to adjust quantities
- Click × to remove an item
- Click "Clear Cart" to remove all items

### Payment
- Click "Pay Now" to show QR code
- Confirm payment to save the order
- Cart will be cleared after payment

### Printing Bill
- Click "Print Bill" to print the current cart as a receipt
- Bill includes all items, quantities, prices, and total

### Menu Management
- Fill in the form to add new items
- Click "Edit" on any item to modify it
- Click "Delete" to remove an item

### Sales Reports
- Select a month from the dropdown
- View statistics for that month
- Reports include total sales, order count, daily breakdown, and top items

## Data Storage

All data is stored in browser's localStorage:
- Menu items: `menuItems`
- Orders: `orders`
- Cart: `cart`

**Note**: Data is stored locally in the browser. Clearing browser data will delete all information.

## Default Menu Items

The system initializes with these default items:
- **Sundal** - ₹30
- **Bread Omelette** - ₹40
- **Cutlets** - ₹35
- **Sandwich** - ₹50

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid

## Libraries Used

- **QRCode.js** (via CDN) - For generating QR codes

## Future Enhancements

- Database integration
- User authentication
- Multiple payment gateways
- Email receipts
- Advanced analytics

