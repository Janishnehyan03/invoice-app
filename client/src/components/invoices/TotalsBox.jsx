

export function TotalsBox({
  subtotal,
  totalSgst,
  totalCgst,
  grandTotal,
  formatCurrency,
}) {
  return (
    <div className="space-y-4 p-6 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
      <div className="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Total SGST</span>
        <span>{formatCurrency(totalSgst)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Total CGST</span>
        <span>{formatCurrency(totalCgst)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg text-indigo-900 border-t pt-4 mt-4">
        <span>Grand Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
}