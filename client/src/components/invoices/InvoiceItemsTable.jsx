import { Button } from "../ui/Button";
import { TrashIcon } from "../ui/TrashIcon";


export function InvoiceItemsTable({
  invoiceItems,
  availableItems,
  isLoadingItems,
  isEditMode,
  onItemSelect,
  onQtyChange,
  onAddItem,
  onRemoveItem,
  formatCurrency,
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Invoice Items</h3>
        <Button
          type="button"
          variant="outline"
          onClick={onAddItem}
          className="text-gray-100 bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-200"
        >
          <span className="mr-1 text-xl font-bold">+</span> Add Item
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50/50">
        <div className="hidden sm:grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 z-10">
          <div className="px-4 py-3 col-span-3">Item</div>
          <div className="px-2 py-3 text-center col-span-1">Qty</div>
          <div className="px-2 py-3 text-right col-span-2">Rate (₹)</div>
          <div className="px-2 py-3 text-right col-span-2">Total (₹)</div>
          <div className="px-2 py-3 text-right col-span-1">SGST (₹)</div>
          <div className="px-2 py-3 text-right col-span-1">CGST (₹)</div>
          <div className="px-2 py-3 text-right col-span-1">Total Amt</div>
          <div className="px-2 py-3 col-span-1"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {invoiceItems.map((it, index) => {
            const itemSubtotal = (it.price || 0) * (it.qty || 0);
            const itemSgstValue = itemSubtotal * ((it.sgst || 0) / 100);
            const itemCgstValue = itemSubtotal * ((it.cgst || 0) / 100);
            const itemTotal = itemSubtotal + itemSgstValue + itemCgstValue;
            const isExistingItem = isEditMode && it.uploaded;
            return (
              <div
                key={index}
                className={`grid grid-cols-12 items-center gap-x-4 gap-y-2 px-4 py-3 text-sm border-b transition ${
                  isExistingItem
                    ? "bg-green-50/50"
                    : index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                {/* Item Select */}
                <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
                  <select
                    id={`item-name-${index}`}
                    value={it.itemId || ""}
                    onChange={(e) => onItemSelect(index, e.target.value)}
                    required
                    className={`w-full rounded-md border bg-white px-3 py-2 text-gray-800 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition ${
                      isExistingItem ? "border-green-300" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      {isLoadingItems ? "Loading items..." : "Select item..."}
                    </option>
                    {availableItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {isExistingItem && (
                    <span className="hidden sm:inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-300">
                      Saved
                    </span>
                  )}
                </div>
                {/* Quantity */}
                <div className="col-span-4 sm:col-span-1">
                  <input
                    id={`item-qty-${index}`}
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={it.qty}
                    onChange={(e) => onQtyChange(index, Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-center text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
                {/* Rate */}
                <div className="col-span-8 sm:col-span-2 text-right text-gray-700 font-medium">
                  {formatCurrency(it.price)}
                </div>
                {/* Subtotal */}
                <div className="col-span-4 sm:col-span-2 text-right text-gray-800 font-medium">
                  {formatCurrency(itemSubtotal)}
                </div>
                {/* SGST */}
                <div className="col-span-4 sm:col-span-1 text-right text-gray-600">
                  {formatCurrency(itemSgstValue)}
                </div>
                {/* CGST */}
                <div className="col-span-4 sm:col-span-1 text-right text-gray-600">
                  {formatCurrency(itemCgstValue)}
                </div>
                {/* Total */}
                <div className="col-span-4 sm:col-span-1 text-right font-semibold text-indigo-700">
                  {formatCurrency(itemTotal)}
                </div>
                {/* Delete */}
                <div className="col-span-12 sm:col-span-1 flex justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="p-2 rounded-md hover:bg-red-100 transition"
                    title="Remove item"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
