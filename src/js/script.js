import { numberToWords } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('receiptForm');
    const itemRows = document.getElementById('itemRows');
    const addItemBtn = document.getElementById('addItem');
    let serialNumber = 1;

    const phonePattern = /^\+?\d{10,15}$/;
    const invoicePattern = /^[A-Z0-9-]{5,20}$/;

    const formatNumberWithCommas = (number) => {
        const parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const cleanNumberInput = (value) => value.replace(/,/g, '');

    const createPopover = (rowIndex) => {
        const popover = document.createElement('div');
        popover.className = 'item-details-popover';
        popover.id = `popover-${rowIndex}`;
        popover.innerHTML = `
            <div class="popover-backdrop"></div>
            <div class="popover-content">
                <h3>Item Details</h3>
                <div class="popover-field">
                    <label for="itemSN-${rowIndex}">Item S/N:</label>
                    <input type="text" id="itemSN-${rowIndex}" name="itemSN" placeholder="Enter Serial Number">
                </div>
                <div class="popover-field">
                    <label for="itemMN-${rowIndex}">Item M/N:</label>
                    <input type="text" id="itemMN-${rowIndex}" name="itemMN" placeholder="Enter Model Number">
                </div>
                <div class="popover-field">
                    <label for="itemIMEI-${rowIndex}">Item IMEI:</label>
                    <input type="text" id="itemIMEI-${rowIndex}" name="itemIMEI" placeholder="Enter IMEI">
                </div>
                <div class="popover-actions">
                    <button type="button" class="save-details" aria-label="Save Details">Save</button>
                    <button type="button" class="cancel-details" aria-label="Cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(popover);
        return popover;
    };

    const showPopover = (popover) => {
        popover.style.display = 'flex';
        setTimeout(() => {
            popover.classList.add('visible');
        }, 10);
    };

    const hidePopover = (popover) => {
        popover.classList.remove('visible');
        setTimeout(() => {
            popover.style.display = 'none';
        }, 300);
    };

    addItemBtn.addEventListener('click', () => {
        if (serialNumber > 20) {
            alert('Maximum limit of 20 rows reached!');
            return;
        }

        const row = document.createElement('tr');
        const rowIndex = serialNumber;
        row.innerHTML = `
            <td><input type="text" name="sn" value="${serialNumber}" readonly aria-label="Serial Number"></td>
            <td><input type="text" name="name" required aria-label="Item Name"></td>
            <td><input type="text" name="description" required aria-label="Item Description"></td>
            <td>
                <button type="button" class="details-btn" aria-label="Add Item Details">Add Details</button>
                <input type="hidden" name="itemDetails" value="">
            </td>
            <td><input type="number" name="qty" min="1" required aria-label="Quantity"></td>
            <td><input type="text" name="unitPrice" required aria-label="Unit Price"></td>
            <td><input type="number" name="discount" min="0" max="100" step="0.01" aria-label="Discount Percentage"></td>
            <td><input type="text" name="amount" readonly aria-label="Amount"></td>
            <td><button type="button" class="removeItem" aria-label="Remove Item">Remove</button></td>
        `;
        itemRows.appendChild(row);
        serialNumber++;

        const detailsBtn = row.querySelector('.details-btn');
        const hiddenInput = row.querySelector('input[name="itemDetails"]');
        const popover = createPopover(rowIndex);

        detailsBtn.addEventListener('click', () => {
            showPopover(popover);
        });

        popover.querySelector('.save-details').addEventListener('click', () => {
            const itemDetails = {
                itemSN: popover.querySelector(`#itemSN-${rowIndex}`).value,
                itemMN: popover.querySelector(`#itemMN-${rowIndex}`).value,
                itemIMEI: popover.querySelector(`#itemIMEI-${rowIndex}`).value
            };
            hiddenInput.value = JSON.stringify(itemDetails);
            detailsBtn.textContent = itemDetails.itemSN || itemDetails.itemMN || itemDetails.itemIMEI ? 'Edit Details' : 'Add Details';
            hidePopover(popover);
        });

        popover.querySelector('.cancel-details').addEventListener('click', () => {
            hidePopover(popover);
        });

        popover.querySelector('.popover-backdrop').addEventListener('click', () => {
            hidePopover(popover);
        });

        row.querySelector('.removeItem').addEventListener('click', () => {
            if (confirm('Are you sure you want to remove this item?')) {
                row.remove();
                popover.remove();
                updateSerialNumbers();
                updateTotals();
            }
        });

        const inputs = row.querySelectorAll('input[name="qty"], input[name="unitPrice"], input[name="discount"]');
        inputs.forEach(input => input.addEventListener('input', calculateAmount));

        row.querySelector('input[name="unitPrice"]').addEventListener('input', function () {
            let cleanValue = cleanNumberInput(this.value);
            if (cleanValue !== '' && !isNaN(cleanValue)) {
                this.value = formatNumberWithCommas(cleanValue);
            }
            calculateAmount({ target: this });
        });
    });

    const updateSerialNumbers = () => {
        const rows = itemRows.querySelectorAll('tr');
        serialNumber = 1;
        rows.forEach(row => {
            row.querySelector('input[name="sn"]').value = serialNumber++;
        });
    };

    const calculateAmount = (event) => {
        const row = event.target.closest('tr');
        const qty = parseFloat(row.querySelector('input[name="qty"]').value) || 0;
        const unitPrice = parseFloat(cleanNumberInput(row.querySelector('input[name="unitPrice"]').value)) || 0;
        const discount = parseFloat(row.querySelector('input[name="discount"]').value) || 0;
        const amount = qty * (unitPrice * (1 - discount / 100));

        row.querySelector('input[name="amount"]').value = formatNumberWithCommas(amount.toFixed(2));
        updateTotals();
    };

    const updateTotals = () => {
        const rows = itemRows.querySelectorAll('tr');
        let itemQty = 0, subTotal = 0, total = 0;

        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('input[name="qty"]').value) || 0;
            const unitPrice = parseFloat(cleanNumberInput(row.querySelector('input[name="unitPrice"]').value)) || 0;
            const discount = parseFloat(row.querySelector('input[name="discount"]').value || 0);

            itemQty += qty;
            subTotal += qty * unitPrice;
            total += qty * (unitPrice * (1 - discount / 100));
        });

        document.getElementById('itemQty').textContent = itemQty;
        document.getElementById('subTotal').textContent = subTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 });
        document.getElementById('total').textContent = total.toLocaleString('en-NG', { minimumFractionDigits: 2 });
        document.getElementById('amountInWords').textContent = numberToWords(total);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const customerName = document.getElementById('customerName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const invoiceNumber = document.getElementById('invoiceNumber').value.trim();

        if (!phonePattern.test(phoneNumber)) {
            alert('Please enter a valid phone number (10-15 digits).');
            return;
        }
        if (!invoicePattern.test(invoiceNumber)) {
            alert('Invoice number must be 5-20 characters (letters, numbers, or hyphens).');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        const rows = itemRows.querySelectorAll('tr');
        const items = Array.from(rows).map((row, index) => {
            const inputs = row.querySelectorAll('input');
            const itemDetails = JSON.parse(inputs[3].value || '{}');
            return {
                sn: index + 1,
                name: inputs[1].value,
                description: inputs[2].value,
                itemDetails,
                qty: parseInt(inputs[4].value) || 0,
                unitPrice: parseFloat(cleanNumberInput(inputs[5].value)) || 0,
                discount: parseFloat(inputs[6].value) || 0,
                amount: parseFloat(cleanNumberInput(inputs[7].value)) || 0
            };
        });

        const receiptData = {
            customerName,
            phoneNumber,
            invoiceNumber,
            date: document.getElementById('date').value,
            paymentMode: document.getElementById('paymentMode').value,
            items,
            itemQty: parseInt(document.getElementById('itemQty').textContent) || 0,
            subTotal: parseFloat(cleanNumberInput(document.getElementById('subTotal').textContent)) || 0,
            total: parseFloat(cleanNumberInput(document.getElementById('total').textContent)) || 0,
            amountInWords: document.getElementById('amountInWords').textContent
        };

        const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        receipts.push({ id: Date.now(), ...receiptData });
        localStorage.setItem('receipts', JSON.stringify(receipts));

        localStorage.setItem('receiptData', JSON.stringify(receiptData));

        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate Receipt';

        window.open('/receipt.html', '_blank');
    });

    const clearItemsBtn = document.createElement('button');
    clearItemsBtn.type = 'button';
    clearItemsBtn.textContent = 'Clear All Items';
    clearItemsBtn.style.marginLeft = '10px';
    addItemBtn.insertAdjacentElement('afterend', clearItemsBtn);
    clearItemsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all items?')) {
            itemRows.innerHTML = '';
            document.querySelectorAll('.item-details-popover').forEach(p => p.remove());
            serialNumber = 1;
            updateTotals();
        }
    });

    const viewReceiptsBtn = document.createElement('button');
    viewReceiptsBtn.type = 'button';
    viewReceiptsBtn.textContent = 'View Past Receipts';
    viewReceiptsBtn.style.marginTop = '10px';
    form.appendChild(viewReceiptsBtn);
    viewReceiptsBtn.addEventListener('click', () => {
        const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';
        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h3>Past Receipts</h3>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="searchReceipts" placeholder="Search by Invoice, Name, or Date" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="sortReceipts" style="margin-right: 10px;">Sort by:</label>
                    <select id="sortReceipts" style="padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                        <option value="date-desc">Date (Newest First)</option>
                        <option value="date-asc">Date (Oldest First)</option>
                        <option value="invoice">Invoice Number</option>
                    </select>
                </div>
                <ul id="receiptList" style="list-style: none; padding: 0;"></ul>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button id="closeModal" style="padding: 8px 16px; background: #790707; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const searchInput = modal.querySelector('#searchReceipts');
        const sortSelect = modal.querySelector('#sortReceipts');
        const receiptList = modal.querySelector('#receiptList');
        const closeModalBtn = modal.querySelector('#closeModal');

        const renderReceipts = (filteredReceipts) => {
            receiptList.innerHTML = filteredReceipts.map(r => `
                <li style="padding: 10px; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
                    <span>Invoice #${r.invoiceNumber} - ${r.customerName} - ${r.date}</span>
                    <div>
                        <button onclick="viewReceipt(${r.id})" style="margin-right: 10px; padding: 5px 10px; background: #022142; color: white; border: none; border-radius: 4px; cursor: pointer;">View</button>
                        <button onclick="deleteReceipt(${r.id})" style="padding: 5px 10px; background: #790707; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                    </div>
                </li>
            `).join('');
        };

        const sortReceipts = (receipts, sortBy) => {
            return [...receipts].sort((a, b) => {
                if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
                if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
                if (sortBy === 'invoice') return a.invoiceNumber.localeCompare(b.invoiceNumber);
                return 0;
            });
        };

        const filterReceipts = (query) => {
            query = query.toLowerCase();
            return receipts.filter(r =>
                r.invoiceNumber.toLowerCase().includes(query) ||
                r.customerName.toLowerCase().includes(query) ||
                r.date.toLowerCase().includes(query)
            );
        };

        const updateReceiptList = () => {
            let filtered = filterReceipts(searchInput.value);
            filtered = sortReceipts(filtered, sortSelect.value);
            renderReceipts(filtered);
        };

        searchInput.addEventListener('input', updateReceiptList);
        sortSelect.addEventListener('change', updateReceiptList);

        renderReceipts(sortReceipts(receipts, 'date-desc'));

        window.deleteReceipt = (id) => {
            if (confirm('Are you sure you want to delete this receipt?')) {
                const updatedReceipts = receipts.filter(r => r.id !== id);
                localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
                updateReceiptList();
            }
        };

        closeModalBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    });

    window.viewReceipt = (id) => {
        const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        const receipt = receipts.find(r => r.id === id);
        if (receipt) {
            localStorage.setItem('receiptData', JSON.stringify(receipt));
            window.open('/receipt.html', '_blank');
        }
    };
});