import { useRef } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

// --- Utility Functions (unchanged, but well-placed) ---

// Simple amount-in-words utility for INR
function amountInWords(num) {
  if (typeof num !== "number" || isNaN(num)) return "";
  if (num === 0) return "Zero Rupees Only";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  function numToWords(n, s) {
    let str = "";
    if (n > 19) str += b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    else str += a[n];
    if (n) str += s;
    return str;
  }
  let out = "";
  let n = Math.floor(num);
  out += numToWords(Math.floor(n / 10000000), " Crore ");
  out += numToWords(Math.floor((n / 100000) % 100), " Lakh ");
  out += numToWords(Math.floor((n / 1000) % 100), " Thousand ");
  out += numToWords(Math.floor((n / 100) % 10), " Hundred ");
  if (n > 100 && n % 100) out += "and ";
  out += numToWords(n % 100, "");
  out = out.replace(/\s+/g, " ").trim();
  let paise = Math.round((num - n) * 100);
  let words = out + " Rupees";
  if (paise) words += " and " + numToWords(paise, "") + " Paise";
  return words + " Only";
}

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0.00";
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

function calculateTotals(items = []) {
  let totalAmount = 0;
  let totalSGST = 0;
  let totalCGST = 0;
  let grandTotal = 0;
  items.forEach((row) => {
    const qty = row.qty || 0;
    const price = row.item?.price || 0;
    const sgst = row.sgst || 0;
    const cgst = row.cgst || 0;
    const lineTotal = qty * price;
    const lineSGST = (lineTotal * sgst) / 100;
    const lineCGST = (lineTotal * cgst) / 100;
    totalAmount += lineTotal;
    totalSGST += lineSGST;
    totalCGST += lineCGST;
    grandTotal += lineTotal + lineSGST + lineCGST;
  });
  return { totalAmount, totalSGST, totalCGST, grandTotal };
}

// --- The Improved Component ---

export function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  const printRef = useRef(null);

  if (!invoice) return null;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  // Calculate summary totals
  const { totalAmount, totalSGST, totalCGST, grandTotal } = calculateTotals(
    invoice.items
  );

  // ✨ KEY IMPROVEMENT: This function now uses the app's live stylesheets.
  const handlePrint = () => {
    if (!printRef.current) return;

    const stylesheets = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          if (styleSheet.href) {
            return `<link rel="stylesheet" href="${styleSheet.href}">`;
          }
          return "";
        }
      })
      .join("\n");

    const printContents = printRef.current.innerHTML;

    // Print-specific CSS for compact, readable tables
    const printTableStyle = `
      @media print {
        html, body {
          font-size: 11px !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table, th, td {
          font-size: 11px !important;
          border: 1px solid #e5e7eb !important;
          border-collapse: collapse !important;
        }
        th, td {
          padding: 3px 6px !important;
        }
        thead tr {
          background: #f1f5f9 !important;
        }
        tbody tr:nth-child(even) {
          background: #f9fafb !important;
        }
        th {
          font-weight: 700 !important;
          color: #334155 !important;
          background: #f1f5f9 !important;
        }
        td {
          color: #22223b !important;
        }
        h1, h2, h3, h4, h5, h6, .text-3xl, .text-2xl, .text-xl, .text-lg {
          font-size: 1em !important;
        }
        .print-payment-details {
          float: right !important;
          text-align: right !important;
        }
      }
    `;

    const fullPrintStyles = `<style>${stylesheets}\n${printTableStyle}</style>`;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
      <head>
        <title>Invoice #${invoice.invoiceNumber}</title>
        ${fullPrintStyles}
      </head>
      <body onload="window.print(); setTimeout(window.close, 100);">
        ${printContents}
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="font-bold text-indigo-700">Invoice</span>
          <span className="text-gray-400 font-medium">
            #{invoice.invoiceNumber}
          </span>
        </span>
      }
      className="max-w-4xl"
    >
      {/* Printable Area */}
      <div ref={printRef} className="space-y-10 text-sm p-4 print:p-0">
        {/* Modern Invoice Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-8 border border-slate-100 print:bg-white print:shadow-none print:border-b print:rounded-none">
          {/* Company Info */}
          <div className="flex flex-col sm:w-1/3">
            <span className="text-xl font-bold text-indigo-700 tracking-tight">
              {invoice.from?.name || "FreshFruits Pvt Ltd"}
            </span>
            <span className="text-gray-600 text-sm mt-1">
              {invoice.from?.fromAddress ||
                "123 Orchard Ave, Mumbai, MH 400001"}
            </span>
            <span className="text-gray-400 text-xs mt-1">
              GSTIN: {invoice.from?.fromGSTIN || "27AAAAA0000A1Z5"}
            </span>
          </div>
          {/* Invoice Meta */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 sm:justify-end sm:items-center text-sm">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-500">Billed To:</span>
              <span className="text-gray-900 font-medium">{invoice.to}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-500">Project:</span>
              <span className="text-gray-900 font-medium">
                {invoice.workName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-500">Issued On:</span>
              <span className="text-gray-900 font-medium">
                {formatDate(invoice.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-semibold mb-3 text-slate-700 text-lg">
            Invoice Items
          </h3>
          <div className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-100 bg-white print:shadow-none print:ring-0">
            <table className="w-full text-left table-auto">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 print:bg-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold text-right">Qty</th>
                  <th className="px-6 py-3 font-semibold text-right">Price</th>
                  <th className="px-6 py-3 font-semibold text-right">SGST</th>
                  <th className="px-6 py-3 font-semibold text-right">CGST</th>
                  <th className="px-6 py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{row.item?.name || "-"}</td>
                    <td className="px-6 py-4 text-right">{row.qty}</td>
                    <td className="px-6 py-4 text-right">
                      {formatCurrency(row.item?.price)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {formatCurrency(
                        ((row.item?.price || 0) *
                          (row.qty || 0) *
                          (row.sgst || 0)) /
                          100
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {formatCurrency(
                        ((row.item?.price || 0) *
                          (row.qty || 0) *
                          (row.cgst || 0)) /
                          100
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {formatCurrency((row.qty || 0) * (row.item?.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals Row */}
              <tfoot>
                <tr className="font-bold bg-indigo-50">
                  <td className="px-6 py-2 text-right" colSpan={2}>
                    Totals:
                  </td>
                  <td className="px-6 py-2 text-right">
                    {formatCurrency(totalAmount)}
                  </td>
                  <td className="px-6 py-2 text-right">
                    {formatCurrency(totalSGST)}
                  </td>
                  <td className="px-6 py-2 text-right">
                    {formatCurrency(totalCGST)}
                  </td>
                  <td className="px-6 py-2 text-right">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
                <tr className="font-bold bg-indigo-100">
                  <td colSpan={5} className="px-6 py-2 text-right">
                    GST Total (SGST + CGST)
                  </td>
                  <td className="px-6 py-2 text-right">
                    {formatCurrency(totalSGST + totalCGST)}
                  </td>
                </tr>
                <tr className="font-bold bg-indigo-200">
                  <td colSpan={5} className="px-6 py-2 text-right">
                    Grand Total
                  </td>
                  <td className="px-6 py-2 text-right">
                    {formatCurrency(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="text-base font-semibold text-blue-700 mt-6 bg-blue-50 rounded-lg px-4 py-2 shadow-sm w-fit print:shadow-none print:bg-blue-50">
          Amount in words: {amountInWords(grandTotal)}
        </div>

        {/* Notes, Payment & Total */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pt-6 border-t border-slate-100 gap-8">
          <div className="flex-1">
            <h3 className="text-gray-500 font-semibold mb-2">Remarks</h3>
            <p className="text-gray-700 bg-slate-50 rounded px-3 py-2 min-h-[32px] print:bg-gray-50">
              {invoice.notes || "No notes provided."}
            </p>
          </div>
        </div>

        {/* Signature */}
        <div className="flex flex-row justify-end mt-12 pt-12 border-t print:border-t-2">
          <div className="min-w-[220px] text-right">
            <div className="text-slate-500 font-medium mb-8">
              Authorised Signature
            </div>
            <div className="border-b-2 border-slate-400 w-48 mx-auto my-6"></div>
          </div>
        </div>
      </div>

      {/* Action buttons are outside the printRef, so they won't be printed. */}
      <div className="flex justify-end gap-3 pt-4 border-t print:hidden">
        <Button variant="secondary" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
