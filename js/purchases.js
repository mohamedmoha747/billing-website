// Purchases management using localStorage (key: purchases)

const PURCHASES_KEY = 'purchases';

function getPurchases() {
    const raw = localStorage.getItem(PURCHASES_KEY);
    return raw ? JSON.parse(raw) : [];
}

function savePurchases(items) {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(items));
}

function generatePurchaseId() {
    return generateId(); // reuse existing util
}

function renderPurchases(filteredItems = null) {
    const items = filteredItems || getPurchases();
    const tbody = document.querySelector('#purchases-table tbody');
    if (!tbody) return;
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999">No purchases recorded</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(p => {
        const total = p.quantity * p.price;
        return `
            <tr data-id="${p.id}">
                <td>${p.name}</td>
                <td>${p.quantity}</td>
                <td>${formatPrice(p.price)}</td>
                <td>${formatPrice(total)}</td>
                <td>${p.date}</td>
                <td>${(p.notes||'')}</td>
                <td>
                    <button class="btn btn-primary" onclick="editPurchase('${p.id}')">Edit</button>
                    <button class="btn btn-secondary" onclick="deletePurchase('${p.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function resetPurchaseForm() {
    const form = document.getElementById('purchase-form');
    if (!form) return;
    form.reset();
    delete form.dataset.editingId;
    document.getElementById('form-title').textContent = 'Add Purchase';
    // set today's date
    const dateInput = document.getElementById('p-date');
    if (dateInput) dateInput.value = new Date().toISOString().substr(0,10);
}

function addPurchaseFromForm() {
    const name = document.getElementById('p-item-name').value.trim();
    const qty = parseFloat(document.getElementById('p-quantity').value);
    const price = parseFloat(document.getElementById('p-price').value);
    const date = document.getElementById('p-date').value;
    const notes = document.getElementById('p-notes').value.trim();

    if (!name || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0 || !date) {
        alert('Please enter valid values for item, quantity, price and date.');
        return;
    }

    const items = getPurchases();
    const newItem = {
        id: generatePurchaseId(),
        name,
        quantity: qty,
        price: price,
        date,
        notes
    };

    items.push(newItem);
    savePurchases(items);
    renderPurchases();
    resetPurchaseForm();
    showNotification('Purchase saved');
}

function editPurchase(id) {
    const items = getPurchases();
    const p = items.find(x => x.id === id);
    if (!p) return;
    document.getElementById('p-item-name').value = p.name;
    document.getElementById('p-quantity').value = p.quantity;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-date').value = p.date;
    document.getElementById('p-notes').value = p.notes || '';
    const form = document.getElementById('purchase-form');
    form.dataset.editingId = id;
    document.getElementById('form-title').textContent = 'Edit Purchase';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePurchaseFromForm(id) {
    const name = document.getElementById('p-item-name').value.trim();
    const qty = parseFloat(document.getElementById('p-quantity').value);
    const price = parseFloat(document.getElementById('p-price').value);
    const date = document.getElementById('p-date').value;
    const notes = document.getElementById('p-notes').value.trim();

    if (!name || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0 || !date) {
        alert('Please enter valid values for item, quantity, price and date.');
        return;
    }

    const items = getPurchases();
    const idx = items.findIndex(x => x.id === id);
    if (idx === -1) return;

    items[idx] = {
        ...items[idx],
        name,
        quantity: qty,
        price,
        date,
        notes
    };

    savePurchases(items);
    renderPurchases();
    resetPurchaseForm();
    showNotification('Purchase updated');
}

function deletePurchase(id) {
    if (!confirm('Delete this purchase?')) return;
    const items = getPurchases();
    const filtered = items.filter(x => x.id !== id);
    savePurchases(filtered);
    renderPurchases();
    showNotification('Purchase deleted');
}

// Initialize form and table on page load
function filterPurchases() {
    const filterDate = document.getElementById('filter-date').value;
    if (!filterDate) {
        alert('Please select a date to filter');
        return;
    }

    const items = getPurchases();
    const filtered = items.filter(p => p.date === filterDate);
    renderPurchases(filtered);
    document.getElementById('date-total').style.display = 'none';
}

function showTotalForDate() {
    const filterDate = document.getElementById('filter-date').value;
    if (!filterDate) {
        alert('Please select a date to show total');
        return;
    }

    const items = getPurchases();
    const filtered = items.filter(p => p.date === filterDate);
    const total = filtered.reduce((sum, p) => sum + (p.quantity * p.price), 0);

    document.getElementById('total-date').textContent = filterDate;
    document.getElementById('total-amount').textContent = formatPrice(total);
    document.getElementById('date-total').style.display = 'block';
}

function clearFilter() {
    document.getElementById('filter-date').value = '';
    document.getElementById('date-total').style.display = 'none';
    renderPurchases();
}

document.addEventListener('DOMContentLoaded', () => {
    // set default date
    const dateInput = document.getElementById('p-date');
    if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().substr(0,10);

    renderPurchases();

    const form = document.getElementById('purchase-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const editingId = form.dataset.editingId;
            if (editingId) {
                updatePurchaseFromForm(editingId);
            } else {
                addPurchaseFromForm();
            }
        });
    }

    const resetBtn = document.getElementById('p-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetPurchaseForm);
});
