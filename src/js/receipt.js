document.addEventListener('DOMContentLoaded', () => {
    const receiptData = JSON.parse(localStorage.getItem('receiptData'));
    if (receiptData) {
        document.getElementById('customerName').textContent = receiptData.customerName;
        document.getElementById('phoneNumber').textContent = receiptData.phoneNumber;
        document.getElementById('date').textContent = receiptData.date;
        document.getElementById('invoiceNumber').textContent = receiptData.invoiceNumber;
        document.getElementById('paymentMode').textContent = receiptData.paymentMode;
        document.getElementById('itemQty').textContent = receiptData.itemQty;
        document.getElementById('subTotal').textContent = `₦${receiptData.subTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
        document.getElementById('total').textContent = `₦${receiptData.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
        document.getElementById('amountInWords').textContent = receiptData.amountInWords;

        const itemRows = document.getElementById('itemRows');
        receiptData.items.forEach(item => {
            const details = [
                item.itemDetails.itemSN ? `<span class="detail-label">S/N:</span> ${item.itemDetails.itemSN}` : '',
                item.itemDetails.itemMN ? `<span class="detail-label">M/N:</span> ${item.itemDetails.itemMN}` : '',
                item.itemDetails.itemIMEI ? `<span class="detail-label">IMEI:</span> ${item.itemDetails.itemIMEI}` : ''
            ].filter(Boolean).join('<br>');
            const row = `<tr>
                <td>${item.sn}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td class="item-details-cell">${details || '-'}</td>
                <td>${item.qty}</td>
                <td>${item.unitPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                <td>${item.discount}</td>
                <td>${item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
            </tr>`;
            itemRows.innerHTML += row;
        });
    }
    localStorage.removeItem('receiptData');
});