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
      const sgstRate = row.sgst || 0;
      const cgstRate = row.cgst || 0;
      const rate = row.item?.price
        ? row.item.price / (1 + (sgstRate + cgstRate) / 100)
        : 0;
      const lineSubtotal = qty * rate;

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
    const printTableStyle = `
      @media print {
        html, body { 
          font-size: 12px !important; 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact; 
          margin: 0;
          padding: 0;
        }
        .print-container {
          height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
          padding: 20px !important;
          box-sizing: border-box !important;
        }
        #invoice-header { flex-shrink: 0; }
        #invoice-items-section { 
          flex: 1;
          min-height: 300px;
          margin: 20px 0 !important;
        }
        #footer-section {
          flex-shrink: 0;
          margin-top: auto !important;
          page-break-inside: avoid;
        }
        table { 
          width: 100% !important;
          border-collapse: collapse !important; 
          font-size: 11px !important;
        }
        th, td { 
          border: 1px solid #e5e7eb !important;
          padding: 8px 6px !important; 
          text-align: left !important;
        }
        th { 
          background: #f8fafc !important; 
          font-weight: bold !important;
          font-size: 10px !important;
        }
        tfoot td { 
          background: #f1f5f9 !important; 
          font-weight: bold !important;
        }
        .no-print-bg { background: white !important; }
        .print-hidden { display: none !important; }
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
      className="max-w-6xl"
    >
      <div
        ref={printRef}
        className="print-container space-y-6 text-sm p-6 print:p-0"
      >
        {/* --- INVOICE HEADER --- */}
        <div
          id="invoice-header"
          className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start bg-gradient-to-br from-indigo-50 via-blue-50 to-white rounded-xl shadow-sm p-6 border border-slate-200 print:bg-white print:shadow-none print:border print:rounded-none"
        >
          <div className="flex items-start gap-4">
            {invoice.from?.name === "Shelter Architects and Builders" && (
              <img
                src="/SHELTER-LOGO.png"
                alt="Company Logo"
                className="h-16 w-auto object-contain flex-shrink-0 mt-1 print:h-12"
              />
            )}
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-indigo-700 tracking-tight print:text-xl">
                {invoice.from?.name || "Company Name"}
              </span>
              <span className="text-gray-600 text-sm mt-2 leading-relaxed max-w-sm">
                {invoice.from?.fromAddress || "Company Address"}
              </span>
              <span className="text-gray-500 text-xs mt-2 font-medium">
                {invoice.from?.fromGSTIN && "GSTIN:"}{" "}
                {invoice.from?.fromGSTIN || " "}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 min-w-[300px] print:shadow-none print:border">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span className="font-semibold text-slate-600">Billed To:</span>
              <span className="text-slate-900 font-medium">{invoice.to}</span>
              <span className="font-semibold text-slate-600">Work Name :</span>
              <span className="text-slate-900 font-medium">
                {invoice.workName}
              </span>
              <span className="font-semibold text-slate-600">Work Code :</span>
              <span className="text-slate-900 font-medium">
                {invoice?.workCode}
              </span>
              <span className="font-semibold text-slate-600">Invoice No:</span>
              <span className="text-slate-900 font-medium">
                {invoice.invoiceNumber}
              </span>
              <span className="font-semibold text-slate-600">
                Invoice Date:
              </span>
              <span className="text-slate-900 font-medium">
                {formatDate(invoice.date)}
              </span>
            </div>
          </div>
        </div>

        {/* --- INVOICE ITEMS TABLE --- */}
        <div
          id="invoice-items-section"
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 print:bg-gray-100">
                <tr className="text-xs text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-4 font-bold text-center w-16">
                    Sl No
                  </th>
                  <th className="px-4 py-4 font-bold text-left min-w-[200px]">
                    Item Description
                  </th>
                  <th className="px-4 py-4 font-bold text-center w-20">Qty</th>
                  <th className="px-4 py-4 font-bold text-right w-28">Rate</th>
                  <th className="px-4 py-4 font-bold text-right w-28">
                    Subtotal
                  </th>
                  <th className="px-4 py-4 font-bold text-right w-24">SGST</th>
                  <th className="px-4 py-4 font-bold text-right w-24">CGST</th>
                  <th className="px-4 py-4 font-bold text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((row, index) => {
                  const qty = row.qty || 0;
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
                    <tr
                      key={index}
                      className="hover:bg-slate-25 print:hover:bg-transparent"
                    >
                      <td className="px-4 py-4 text-center font-medium text-slate-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {row.item?.name || "-"}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-700">
                        {qty}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-700">
                        {formatCurrency(rate)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-800">
                        {formatCurrency(lineSubtotal)}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-600">
                        {formatCurrency(lineSGST)}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-600">
                        {formatCurrency(lineCGST)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-indigo-700">
                        {formatCurrency(lineTotalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 print:bg-gray-100">
                  <td
                    className="px-4 py-4 text-right font-bold text-slate-800"
                    colSpan={4}
                  >
                    TOTAL:
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800">
                    {formatCurrency(subtotal)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800">
                    {formatCurrency(totalSGST)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800">
                    {formatCurrency(totalCGST)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-xl text-indigo-700">
                    {formatCurrency(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* --- FOOTER SECTION --- */}
        <div id="footer-section" className="space-y-6 pt-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Remarks Section with Amount in Words */}
            <div className="flex-1">
              <h3 className="text-slate-600 font-bold mb-3 text-base">
                Remarks & Amount in Words
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3 print:bg-gray-50">
                <div className="text-slate-700 leading-relaxed min-h-[60px]">
                  {invoice.notes || "No additional remarks provided."}
                </div>
                <div className="border-t border-slate-300 pt-3 mt-3">
                  <p className="font-semibold text-indigo-800 text-sm">
                    <span className="text-slate-600 font-medium">
                      Amount in Words:{" "}
                    </span>
                    {amountInWords(grandTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tax Summary and Signature */}
            <div className="lg:min-w-[320px] space-y-6">
              {/* Tax Summary */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">
                  Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Total SGST:</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(totalSGST)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Total CGST:</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(totalCGST)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-3">
                    <div className="flex justify-between items-center py-1">
                      <span className="font-bold text-slate-800">
                        Grand Total:
                      </span>
                      <span className="font-bold text-lg text-indigo-700">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="text-center">
                <div className="h-20 mb-4"></div>
                <div className="border-t-2 border-slate-400 pt-3 max-w-[200px] mx-auto">
                  <p className="font-bold text-slate-800 text-sm">
                    For{" "}
                    {invoice.from?.name || "Shelter Architects and Builders"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Authorised Signatory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 print:hidden print-hidden">
        <Button variant="secondary" onClick={handlePrint} className="px-6">
          📄 Print Invoice
        </Button>
        <Button variant="primary" onClick={onClose} className="px-6">
          Close
        </Button>
      </div>
    </Modal>
  );
}
