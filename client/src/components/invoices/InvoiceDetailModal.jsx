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
    // --- MODIFIED SECTION ---
    const printTableStyle = `
      @media print {
        html, body { font-size: 13px !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; height: 100%; }
        #invoice-items-section { 
          position: relative; 
          min-height: 200px;
          margin-top: 12vh !important;
          margin-bottom: 0;
        }
        #footer-section {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          width: 100vw;
          padding-bottom: 24px;
          background: white !important;
          z-index: 999;
        }
        table, th, td { font-size: 13px !important; border: 1px solid #e5e7eb !important; border-collapse: collapse !important; }
        th, td { padding: 5px 8px !important; }
        thead tr { background: #f1f5f9 !important; }
        tfoot tr { background: #f1f5f9 !important; font-weight: bold; }
        tbody tr:nth-child(even) { background: #f9fafb !important; }
        th { font-weight: 700 !important; color: #334155 !important; }
        .no-print-bg { background: white !important; }
      }
    `;
    // --- END MODIFIED SECTION ---
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
      <div
        ref={printRef}
        className="space-y-8 text-sm p-4 print:p-0 print:h-[100vh] h-full relative"
      >
        {/* --- INVOICE HEADER --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-6 border border-slate-100 print:bg-white print:shadow-none print:border-b print:rounded-none no-print-bg">
          <div className="flex items-start gap-4">
            {invoice.from?.name === "Shelter Architects and Builders" && (
              <img
                src="/SHELTER-LOGO.png"
                alt="Company Logo"
                className="h-14 w-auto object-contain flex-shrink-0 mt-1"
              />
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-indigo-700 tracking-tight">
                {invoice.from?.name || "Company Name"}
              </span>
              <span className="text-gray-600 text-sm mt-1">
                {invoice.from?.fromAddress || "Company Address"}
              </span>
              <span className="text-gray-500 text-xs mt-1">
                GSTIN: {invoice.from?.fromGSTIN || "32CXSPA4511R1Z6"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm flex-shrink-0">
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

        {/* --- INVOICE ITEMS TABLE (slightly top of center) --- */}
        <div
          id="invoice-items-section"
          className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-100 bg-white print:shadow-none print:ring-0 print:relative print:mt-[12vh]"
          style={{
            marginTop: "6vh",
            marginBottom: 0,
          }}
        >
          <table className="w-full text-left table-auto">
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
              {invoice.items.map((row, index) => {
                const qty = row.qty || 0;
                // Subtract SGST and CGST from the price to get base rate
                const sgstRate = row.sgst || 0;
                const cgstRate = row.cgst || 0;
                const rate = row.item?.price
                  ? row.item.price / (1 + (sgstRate + cgstRate) / 100)
                  : 0;

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

        {/* --- FOOTER at the absolute bottom of PDF --- */}
        <div
          id="footer-section"
          className="pt-8 mt-4 border-t border-slate-200 space-y-6 print:pt-0 print:mt-0 print:border-t print:bg-white print:fixed print:left-0 print:right-0 print:bottom-0 print:w-full"
          style={{
            position: "static",
          }}
        >
          <div className="text-base font-semibold text-indigo-800 bg-indigo-50 rounded-lg px-4 py-3 shadow-sm print:shadow-none print:bg-indigo-50 no-print-bg">
            <span className="font-medium text-slate-600">
              Amount in words:{" "}
            </span>
            {amountInWords(grandTotal)}
          </div>
          <div className="flex justify-between items-end gap-8">
            <div className="flex-grow">
              <h3 className="text-gray-500 font-semibold mb-2">Remarks</h3>
              <p className="text-gray-700 bg-slate-50 rounded-lg p-3 min-h-[80px] border border-slate-200 print:bg-gray-50 no-print-bg">
                {invoice.notes || "No notes provided."}
              </p>
            </div>
            <div className="min-w-[240px] text-center flex-shrink-0">
              <div className="h-20" /> {/* Spacer for signature */}
              <div className="border-t border-slate-400 pt-2">
                <p className="font-semibold text-slate-800">
                  For {invoice.from?.name || "Shelter Architects and Builders"}
                </p>
                <p className="text-sm text-slate-500">Authorised Signatory</p>
              </div>
            </div>
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
