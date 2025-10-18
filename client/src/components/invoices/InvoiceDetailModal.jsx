import { useRef } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

// --- Utility Helpers ---
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Simple amount-in-words utility for INR
function amountInWords(num) {
  num = Number(num) || 0;
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
  let paise = Math.round((Math.abs(num) - Math.floor(Math.abs(num))) * 100);
  let words = out + " Rupees";
  if (paise) {
    // convert paise number to words (max 99)
    let paiseWords = "";
    if (paise > 19)
      paiseWords =
        b[Math.floor(paise / 10)] + (paise % 10 ? " " + a[paise % 10] : "");
    else paiseWords = a[paise];
    words += " and " + paiseWords + " Paise";
  }
  return words + " Only";
}

const formatCurrency = (amount) => {
  const n = safeNumber(amount);
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// --- Calculation logic ---
// FIX: Apply rounding at the line-item level, identical to the table body,
// to prevent rounding discrepancies between the line items and the summary footer.
function calculateTotals(items = []) {
  // GST is display-only. Grand total = sum of (rate * qty) only.
  const acc = items.reduce(
    (accum, row) => {
      const qty = safeNumber(row.qty);
      const sgstRate = safeNumber(row.sgst ?? row.item?.sgst);
      const cgstRate = safeNumber(row.cgst ?? row.item?.cgst);
      const unitPrice = safeNumber(row.item?.price);

      // line amounts based only on rate * qty
      const lineSubtotal = Math.round(unitPrice * qty * 100) / 100;

      // GST calculated from the same rate*qty but kept for display only
      const lineSGST =
        Math.round(((unitPrice * qty * sgstRate) / 100) * 100) / 100;
      const lineCGST =
        Math.round(((unitPrice * qty * cgstRate) / 100) * 100) / 100;

      accum.subtotal += lineSubtotal;
      accum.totalSGST += lineSGST;
      accum.totalCGST += lineCGST;

      return accum;
    },
    { subtotal: 0, totalSGST: 0, totalCGST: 0 }
  );

  const subtotal = Math.round(acc.subtotal * 100) / 100;
  const totalSGST = Math.round(acc.totalSGST * 100) / 100;
  const totalCGST = Math.round(acc.totalCGST * 100) / 100;

  // Grand total does NOT include GST here (GST is display-only)

  return {
    subtotal,
    totalSGST,
    totalCGST,
  };
}
// --- Component ---
export function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  console.log("InvoiceDetailModal invoice:", invoice);
  const printRef = useRef(null);

  if (!invoice) return null;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

  const items = Array.isArray(invoice.items) ? invoice.items : [];

  const { subtotal, totalSGST, totalCGST } = calculateTotals(items);

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
        img[alt="Company Logo"].print-logo,
        img[alt="Company Logo"] {
          height: 80px !important;
          width: auto !important;
          max-width: 100% !important;
        }
      }
    `;
    const fullPrintStyles = `<style>${stylesheets}\n${printTableStyle}</style>`;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${invoice.invoiceNumber || ""}</title>
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
            #{invoice.invoiceNumber || "N/A"}
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
                className="h-32 w-auto object-contain flex-shrink-0 mt-1 print:h-12"
              />
            )}
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-indigo-700 tracking-tight print:text-xl">
                {invoice.from?.name || "Company Name"}
              </span>
              <span className="text-gray-600 text-sm mt-2 leading-relaxed max-w-sm">
                {invoice.from?.fromAddress || "Company Address"}
              </span>
              {invoice.from?.fromGSTIN &&
                invoice.from.fromGSTIN.trim() !== "_" && (
                  <span className="text-gray-500 text-xs mt-2 font-medium">
                    GSTIN: {invoice.from.fromGSTIN}
                  </span>
                )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 min-w-[300px] print:shadow-none print:border">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span className="font-semibold text-slate-600">Billed To:</span>
              <span className="text-slate-900 font-medium">
                {invoice.client?.name || "Client"}
              </span>
              <span className="font-semibold text-slate-600">Work Name :</span>
              <span className="text-slate-900 font-medium">
                {invoice.workName || "-"}
              </span>
              <span className="font-semibold text-slate-600">Work Code :</span>
              <span className="text-slate-900 font-medium">
                {invoice?.workCode || "-"}
              </span>
              <span className="font-semibold text-slate-600">Invoice No:</span>
              <span className="text-slate-900 font-medium">
                {invoice.invoiceNumber || "-"}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((row, index) => {
                  const qty = safeNumber(row.qty);
                  const sgstRate = safeNumber(row.sgst ?? row.item?.sgst);
                  const cgstRate = safeNumber(row.cgst ?? row.item?.cgst);
                  const unitPrice = safeNumber(row.item?.price);

                  const lineSubtotal = Math.round(unitPrice * qty * 100) / 100;
                  const lineSGST =
                    Math.round(((lineSubtotal * sgstRate) / 100) * 100) / 100;
                  const lineCGST =
                    Math.round(((lineSubtotal * cgstRate) / 100) * 100) / 100;
                  const lineTotalAmount =
                    Math.round((lineSubtotal + lineSGST + lineCGST) * 100) /
                    100;

                  return (
                    <tr
                      key={row._id || index}
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
                        {/* Show the exact unit price as stored (tax exclusive) */}
                        {formatCurrency(unitPrice)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-800">
                        {formatCurrency(lineSubtotal)}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-600">
                        {/* show both rate% and amount */}
                        <div className="text-xs text-slate-500">
                          {sgstRate}%
                        </div>
                        <div>{formatCurrency(lineSGST)}</div>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-600">
                        <div className="text-xs text-slate-500">
                          {cgstRate}%
                        </div>
                        <div>{formatCurrency(lineCGST)}</div>
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
                    {amountInWords(subtotal)}
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
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(subtotal)}
                    </span>
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
