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
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Invoice Items
        </h3>

        <Button
          type="button"
          variant="outline"
          onClick={onAddItem}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white 
          bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 
          shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
        >
          <span className="text-lg leading-none">＋</span>
          Add Item
        </Button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-50/80 text-[13px] font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200">
          <div className="px-4 py-3 col-span-3">Item</div>
          <div className="px-2 py-3 text-center col-span-1">Qty</div>
          <div className="px-2 py-3 text-right col-span-2">Rate (₹)</div>
          <div className="px-2 py-3 text-right col-span-2">Subtotal (₹)</div>
          <div className="px-2 py-3 text-right col-span-1">SGST</div>
          <div className="px-2 py-3 text-right col-span-1">CGST</div>
          <div className="px-2 py-3 text-right col-span-1">Total</div>
          <div className="px-2 py-3 text-center col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {invoiceItems.map((it, index) => {
            const itemSubtotal = (it.price || 0) * (it.qty || 0);
            const itemSgstValue = itemSubtotal * ((it.sgst || 0) / 100);
            const itemCgstValue = itemSubtotal * ((it.cgst || 0) / 100);
            const itemTotal = itemSubtotal + itemSgstValue + itemCgstValue;
            const isExistingItem = isEditMode && it.uploaded;

            return (
              <div
                key={index}
                className={`grid grid-cols-12 items-center gap-x-4 px-4 py-4 text-sm transition-all duration-200 
                ${
                  isExistingItem
                    ? "bg-green-50 hover:bg-green-100/70"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Item Select */}
                <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
                  <select
                    id={`item-${index}`}
                    value={it.itemId || ""}
                    onChange={(e) => onItemSelect(index, e.target.value)}
                    required
                    className={`w-full rounded-lg border px-3 py-2 text-sm bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition
                      ${isExistingItem ? "border-green-300" : "border-gray-200"}`}
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
                    <span className="px-2 py-0.5 text-xs rounded-md bg-green-100 text-green-700 border border-green-200 font-medium">
                      Saved
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-1">
                  <input
                    id={`qty-${index}`}
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={it.qty}
                    onChange={(e) =>
                      onQtyChange(index, parseFloat(e.target.value))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 text-center px-2 py-1.5 text-gray-700 
                      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                {/* Rate */}
                <div className="col-span-4 sm:col-span-2 text-right text-gray-700 font-medium">
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

                {/* Delete Button */}
                <div className="col-span-12 sm:col-span-1 flex justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-150"
                    title="Remove item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {invoiceItems.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No items added yet. Click <strong>“Add Item”</strong> to begin.
          </div>
        )}
      </div>
    </section>
  );
}
