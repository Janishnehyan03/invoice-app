import { useRef } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

// --- Utility Functions ---

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

// --- CHANGE: Renamed totalAmount to subtotal for clarity ---
function calculateTotals(items = []) {
  const totals = items.reduce(
    (acc, row) => {
      const qty = row.qty || 0;
      const price = row.item?.price || 0;
      const sgstRate = row.sgst || 0;
      const cgstRate = row.cgst || 0;
      const lineSubtotal = qty * price;

      acc.subtotal += lineSubtotal;
      acc.totalSGST += (lineSubtotal * sgstRate) / 100;
      acc.totalCGST += (lineSubtotal * cgstRate) / 100;

      return acc;
    },
    { subtotal: 0, totalSGST: 0, totalCGST: 0 }
  );

  const grandTotal = totals.subtotal + totals.totalSGST + totals.totalCGST;
  return { ...totals, grandTotal };
}

// --- The Component ---

export function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  const printRef = useRef(null);

  if (!invoice) return null;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

  // --- CHANGE: Renamed totalAmount to subtotal for clarity ---
  const { subtotal, totalSGST, totalCGST, grandTotal } = calculateTotals(
    invoice.items
  );

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
    const printTableStyle = `
      @media print {
        html, body { font-size: 11px !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        table, th, td { font-size: 11px !important; border: 1px solid #e5e7eb !important; border-collapse: collapse !important; }
        th, td { padding: 4px 6px !important; }
        thead tr { background: #f1f5f9 !important; }
        tfoot tr { background: #f1f5f9 !important; font-weight: bold; }
        tbody tr:nth-child(even) { background: #f9fafb !important; }
        th { font-weight: 700 !important; color: #334155 !important; }
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
      className="max-w-5xl"
    >
      <div ref={printRef} className="space-y-8 text-sm p-4 print:p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-6 border border-slate-100 print:bg-white print:shadow-none print:border-b print:rounded-none">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-indigo-700 tracking-tight">
              {invoice.from?.name || "Company Name"}
            </span>
            <span className="text-gray-600 text-sm mt-1">
              {invoice.from?.fromAddress || "Company Address"}
            </span>
            <span className="text-gray-500 text-xs mt-1">
              {/* --- CHANGE: Updated GSTIN to match image --- */}
              GSTIN: {invoice.from?.fromGSTIN || "32CXSPA4511R1Z6"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <span className="font-semibold text-gray-500">Billed To:</span>
            <span className="text-gray-900 font-medium">{invoice.to}</span>
            <span className="font-semibold text-gray-500">Work:</span>
            <span className="text-gray-900 font-medium">
              {invoice.workName}
            </span>
            <span className="font-semibold text-gray-500">Issued On:</span>
            <span className="text-gray-900 font-medium">
              {formatDate(invoice.date)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-100 bg-white print:shadow-none print:ring-0">
          <table className="w-full text-left table-auto">
            {/* --- CHANGE: Table headers updated to match invoice image --- */}
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 print:bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-center">Sl No</th>
                <th className="px-4 py-3 font-semibold">Item Description</th>
                <th className="px-4 py-3 font-semibold text-center">Qty</th>
                <th className="px-4 py-3 font-semibold text-right">Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
                <th className="px-4 py-3 font-semibold text-right">SGST</th>
                <th className="px-4 py-3 font-semibold text-right">CGST</th>
                <th className="px-4 py-3 font-semibold text-right">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* --- CHANGE: Table rows updated with new columns and calculations --- */}
              {invoice.items.map((row, index) => {
                const qty = row.qty || 0;
                const rate = row.item?.price || 0;
                const sgstRate = row.sgst || 0;
                const cgstRate = row.cgst || 0;
                const lineSubtotal = qty * rate;
                const lineSGST = (lineSubtotal * sgstRate) / 100;
                const lineCGST = (lineSubtotal * cgstRate) / 100;
                const lineTotalAmount = lineSubtotal + lineSGST + lineCGST;

                return (
                  <tr key={index}>
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3">{row.item?.name || "-"}</td>
                    <td className="px-4 py-3 text-center">{qty}</td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(rate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(lineSubtotal)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(lineSGST)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(lineCGST)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-indigo-700">
                      {formatCurrency(lineTotalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* --- CHANGE: Footer simplified to a single totals row --- */}
            <tfoot className="bg-slate-50">
              <tr className="font-bold text-slate-800">
                <td className="px-4 py-3 text-right" colSpan={4}>
                  Total:
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(subtotal)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(totalSGST)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(totalCGST)}
                </td>
                <td className="px-4 py-3 text-right text-indigo-700">
                  {formatCurrency(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="text-base font-semibold text-blue-700 bg-blue-50 rounded-lg px-4 py-2 shadow-sm w-fit print:shadow-none print:bg-blue-50">
          Amount in words: {amountInWords(grandTotal)}
        </div>

        <div className="flex justify-between items-start pt-6 border-t border-slate-100 gap-8">
          <div>
            <h3 className="text-gray-500 font-semibold mb-2">Remarks</h3>
            <p className="text-gray-700 bg-slate-50 rounded px-3 py-2 min-h-[32px] print:bg-gray-50">
              {invoice.notes || "No notes provided."}
            </p>
          </div>
          <div className="min-w-[220px] text-center mt-12">
            <div className="text-slate-500 font-medium">
              Authorised Signature
            </div>
            <div className="border-b-2 border-slate-300 w-48 mx-auto mt-16"></div>
          </div>
        </div>
      </div>

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
