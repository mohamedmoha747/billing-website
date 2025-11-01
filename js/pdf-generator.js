// Function to close bill preview modal
function closeBillPreview() {
    const modal = document.getElementById('bill-preview-modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Function to download bill as PDF
function downloadBillAsPDF() {
    const cart = Storage.getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date();
    const billNo = generateId().substr(0, 8).toUpperCase();

    // Create PDF using jsPDF with autotable
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add restaurant name
    doc.setFontSize(20);
    doc.text('RESTAURANT', 105, 15, { align: 'center' });
    
    // Add bill info
    doc.setFontSize(10);
    doc.text(`Date: ${formatDate(now)}`, 20, 30);
    doc.text(`Bill No: ${billNo}`, 20, 37);

    // Create table data
    const tableData = cart.map(item => [
        item.name,
        item.quantity.toString(),
        formatPrice(item.price),
        formatPrice(item.price * item.quantity)
    ]);

    // Add items table
    doc.autoTable({
        head: [['Item', 'Qty', 'Price', 'Total']],
        body: tableData,
        startY: 45,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [100, 100, 100]
        }
    });

    // Add total
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(total)}`, 190, finalY + 10, { align: 'right' });

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you! Visit again!', 105, finalY + 25, { align: 'center' });

    // Save the PDF
    doc.save(`Restaurant-Bill-${billNo}.pdf`);
    showNotification('Bill downloaded as PDF');
}