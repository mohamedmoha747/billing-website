// Sales report functionality

// Load and display monthly sales report
function loadSalesReport() {
    const monthSelect = document.getElementById('month-select');
    const reportContent = document.getElementById('report-content');
    
    if (!monthSelect || !reportContent) return;

    // Set default to current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    monthSelect.value = currentMonth;
    
    // Generate month options (last 12 months)
    const months = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
        months.push({ value: monthStr, label: monthLabel });
    }
    
    monthSelect.innerHTML = months.map(m => 
        `<option value="${m.value}">${m.label}</option>`
    ).join('');
    
    monthSelect.value = currentMonth;
    
    // Load initial report
    updateSalesReport(currentMonth);
    
    // Add event listener
    monthSelect.addEventListener('change', (e) => {
        updateSalesReport(e.target.value);
    });
}

// Update sales report for selected month
function updateSalesReport(month) {
    const orders = Storage.getOrders();
    const reportContent = document.getElementById('report-content');
    
    if (!reportContent) return;

    // Filter orders for selected month
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        return orderMonth === month;
    });

    if (monthOrders.length === 0) {
        reportContent.innerHTML = `
            <div class="report-empty">
                <p>No orders found for the selected month.</p>
            </div>
        `;
        return;
    }

    // Calculate statistics
    const totalSales = monthOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = monthOrders.length;
    const averageOrder = totalSales / totalOrders;

    // Get daily breakdown
    const dailyBreakdown = {};
    monthOrders.forEach(order => {
        const date = formatDateInput(order.date);
        if (!dailyBreakdown[date]) {
            dailyBreakdown[date] = { count: 0, total: 0 };
        }
        dailyBreakdown[date].count += 1;
        dailyBreakdown[date].total += order.total;
    });

    // Get top selling items
    const itemSales = {};
    monthOrders.forEach(order => {
        order.items.forEach(item => {
            if (!itemSales[item.name]) {
                itemSales[item.name] = { quantity: 0, revenue: 0 };
            }
            itemSales[item.name].quantity += item.quantity;
            itemSales[item.name].revenue += item.price * item.quantity;
        });
    });

    const topItems = Object.entries(itemSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    // Display report
    reportContent.innerHTML = `
        <div class="report-stats">
            <div class="stat-card">
                <h3>Total Sales</h3>
                <p class="stat-value">${formatPrice(totalSales)}</p>
            </div>
            <div class="stat-card">
                <h3>Total Orders</h3>
                <p class="stat-value">${totalOrders}</p>
            </div>
            <div class="stat-card">
                <h3>Average Order</h3>
                <p class="stat-value">${formatPrice(averageOrder)}</p>
            </div>
        </div>

        <div class="report-section">
            <h3>Daily Breakdown</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Orders</th>
                        <th>Sales</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(dailyBreakdown)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([date, data]) => `
                            <tr>
                                <td>${new Date(date).toLocaleDateString('en-IN', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}</td>
                                <td>${data.count}</td>
                                <td>${formatPrice(data.total)}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        </div>

        <div class="report-section">
            <h3>Top Selling Items</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${topItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${formatPrice(item.revenue)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('month-select')) {
        loadSalesReport();
    }
});


