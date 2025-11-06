export function TotalsBox({
  subtotal,
  totalSgst,
  totalCgst,
  grandTotal,
  formatCurrency,
}) {
  return (
    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Gradient Accent Bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />

      <div className="p-6 space-y-5">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Subtotal</span>
          <span className="tabular-nums">{formatCurrency(subtotal)}</span>
        </div>

        {/* SGST */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Total SGST</span>
          <span className="tabular-nums">{formatCurrency(totalSgst)}</span>
        </div>

        {/* CGST */}
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Total CGST</span>
          <span className="tabular-nums">{formatCurrency(totalCgst)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Grand Total */}
        <div className="flex justify-between items-center font-bold text-lg text-indigo-700">
          <span>Grand Total</span>
          <span className="tabular-nums text-2xl text-gray-900 tracking-tight">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
