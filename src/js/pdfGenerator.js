import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePDF(receiptData) {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('OCTAVIAN DYNAMICS ENTERPRISES LTD', 20, 20);
    doc.text('17 Chief Benjamin Wopara Plaza, Ogbum Nagbali, Eastern Bypass, Port Harcourt, Rivers State.', 20, 30);
    doc.text('Phone: +234 915 574 3615', 20, 40);

    doc.text(`Invoice No: ${receiptData.invoiceNumber}`, 150, 50, { align: 'right' });
    doc.text(`Date: ${receiptData.date}`, 150, 60, { align: 'right' });
    doc.text(`Customer: ${receiptData.customerName}`, 20, 50);
    doc.text(`Phone: ${receiptData.phoneNumber}`, 20, 60);

    const tableData = receiptData.items.map(item => {
        const details = [
            item.itemDetails.itemSN ? `S/N: ${item.itemDetails.itemSN}` : '',
            item.itemDetails.itemMN ? `M/N: ${item.itemDetails.itemMN}` : '',
            item.itemDetails.itemIMEI ? `IMEI: ${item.itemDetails.itemIMEI}` : ''
        ].filter(Boolean).join('\n');
        return [
            item.sn,
            item.name,
            item.description,
            details || '-',
            item.qty,
            item.unitPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 }),
            item.discount,
            item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })
        ];
    });

    autoTable(doc, {
        startY: 80,
        head: [['S/N', 'Name', 'Description', 'Item Details', 'Qty', 'Unit Price (₦)', 'Discount (%)', 'Amount']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [3, 53, 105] },
        columnStyles: {
            3: { cellWidth: 40, overflow: 'linebreak' } // Item Details column
        }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Item Qty: ${receiptData.itemQty}`, 150, finalY, { align: 'right' });
    doc.text(`Sub Total: ₦${receiptData.subTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`, 150, finalY + 10, { align: 'right' });
    doc.text(`Total: ₦${receiptData.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`, 150, finalY + 20, { align: 'right' });
    doc.text(`Amount in Words: ${receiptData.amountInWords}`, 20, finalY + 30);

    doc.text('Terms & Conditions', 20, finalY + 50);
    doc.text('New devices procured from OCTAVIAN DYNAMICS ENTERPRISES LTD fall under standard manufacturers warranty.', 20, finalY + 60);

    doc.save(`Invoice_${receiptData.invoiceNumber}.pdf`);
}