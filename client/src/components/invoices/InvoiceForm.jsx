import { useEffect, useMemo, useState } from "react";
import Axios from "../../utils/Axios";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { TrashIcon } from "../ui/TrashIcon";

// A reusable Select component for consistency
function Select({ id, label, children, ...props }) {
  return (
    <div className="mb-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        {...props}
        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150 ease-in-out sm:text-sm"
      >
        {children}
      </select>
    </div>
  );
}

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export function InvoiceForm({
  onCreated,
  onUpdated,
  onClose,
  invoiceToEdit = null,
}) {
  const companies = [
    {
      name: "Aneesh kandoth kandiyil",
      address: "_",
      mobile: "9745834089",
      gstin: "32CXSPA4511R1Z6", // Updated based on image
    },
    {
      name: "Asees Nelliyullathil",
      address: "_",
      mobile: "9747807594",
      gstin: "32AWHPN0956D1ZS",
    },
    {
      name: "Shelter Architects and Builders",
      address: "_",
      mobile: "9999999999",
      gstin: "_"
    },
  ];
  // --- STATE MANAGEMENT ---
  const [company, setCompany] = useState(companies[0]);
  const [workName, setWorkName] = useState("");
  const [workCode, setWorkCode] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState(() => ({
    fromAddress: company?.address || "",
    fromMobile: company?.mobile || "",
    fromGSTIN: company?.gstin || "",
    name: company?.name || "",
  }));
  const [date, setDate] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([
    {
      itemId: "",
      description: "",
      qty: 1,
      price: 0,
      sgst: 0,
      cgst: 0,
      uploaded: false,
    },
  ]);
  const [availableItems, setAvailableItems] = useState([]);

  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(invoiceToEdit?._id);

  // --- DATA FETCHING ---
  useEffect(() => {
    const getAvailableItems = async () => {
      try {
        setIsLoadingItems(true);
        const response = await Axios.get("/items");
        setAvailableItems(response.data || []);
      } catch (error) {
        console.error("Error fetching available items:", error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    getAvailableItems();
  }, []);

  // Hydrate invoice items ONLY when entering edit mode or invoiceToEdit changes
  useEffect(() => {
    if (isEditMode && invoiceToEdit) {
      setWorkName(invoiceToEdit.workName);
      setTo(invoiceToEdit.to);
      setDate(new Date(invoiceToEdit.date).toISOString().substring(0, 10));
      setNotes(invoiceToEdit.notes || "");

      setInvoiceItems(
        invoiceToEdit.items.map((itemOnInvoice) => {
          let itemId = itemOnInvoice.item?._id || itemOnInvoice.item;
          // Try to get details from availableItems if possible
          const fullItem = availableItems.find((i) => i._id === itemId);
          return {
            itemId: fullItem?._id || itemId || "",
            description:
              fullItem?.name || itemOnInvoice.description || "Item not found",
            price: fullItem?.price ?? itemOnInvoice.price ?? 0,
            qty: itemOnInvoice.qty,
            sgst: fullItem?.sgst ?? itemOnInvoice.sgst ?? 0,
            cgst: fullItem?.cgst ?? itemOnInvoice.cgst ?? 0,
            uploaded: true,
          };
        })
      );
    } else if (!isEditMode) {
      setInvoiceItems([
        {
          itemId: "",
          description: "",
          qty: 1,
          price: 0,
          sgst: 0,
          cgst: 0,
          uploaded: false,
        },
      ]);
    }
    // Only hydrate when invoiceToEdit or isEditMode changes, not availableItems!
  }, [invoiceToEdit, isEditMode]);

  // If availableItems arrive after invoice is hydrated, fill in new details for existing items
  useEffect(() => {
    if (availableItems.length === 0) return;
    setInvoiceItems((prev) =>
      prev.map((item) => {
        if (!item.itemId) return item;
        const fullItem = availableItems.find((i) => i._id === item.itemId);
        if (!fullItem) return item;
        return {
          ...item,
          description: fullItem.name,
          price: fullItem.price ?? 0,
          sgst: fullItem.sgst ?? 0,
          cgst: fullItem.cgst ?? 0,
        };
      })
    );
  }, [availableItems]);

  useEffect(() => {
    setFrom({
      fromAddress: company?.address || "",
      fromMobile: company?.mobile || "",
      fromGSTIN: company?.gstin || "",
      name: company?.name || "",
    });
  }, [company]);

  // --- CALCULATIONS ---
  const { subtotal, totalSgst, totalCgst, grandTotal } = useMemo(() => {
    return invoiceItems.reduce(
      (acc, item) => {
        const itemSubtotal = (item.price || 0) * (item.qty || 0);
        const itemSgst = itemSubtotal * ((item.sgst || 0) / 100);
        const itemCgst = itemSubtotal * ((item.cgst || 0) / 100);

        acc.subtotal += itemSubtotal;
        acc.totalSgst += itemSgst;
        acc.totalCgst += itemCgst;
        acc.grandTotal += itemSubtotal + itemSgst + itemCgst;

        return acc;
      },
      { subtotal: 0, totalSgst: 0, totalCgst: 0, grandTotal: 0 }
    );
  }, [invoiceItems]);

  // --- ITEM MANIPULATION HANDLERS ---
  const handleItemSelect = (index, selectedItemId) => {
    const selectedItem = availableItems.find(
      (item) => item._id === selectedItemId
    );
    setInvoiceItems((prev) => {
      const next = [...prev];
      const currentItem = next[index];

      if (selectedItem) {
        next[index] = {
          ...currentItem,
          itemId: selectedItem._id,
          description: selectedItem.name,
          price: selectedItem.price,
          sgst: selectedItem.sgst,
          cgst: selectedItem.cgst,
          uploaded: false,
        };
      } else {
        next[index] = {
          ...currentItem,
          itemId: "",
          description: "",
          price: 0,
          sgst: 0,
          cgst: 0,
          uploaded: false,
        };
      }
      return next;
    });
  };

  const updateItemQty = (index, qty) => {
    setInvoiceItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], qty: Math.max(1, Number(qty)) };
      return next;
    });
  };

  const addItem = () =>
    setInvoiceItems((prev) => [
      ...prev,
      {
        itemId: "",
        description: "",
        qty: 1,
        price: 0,
        sgst: 0,
        cgst: 0,
        uploaded: false,
      },
    ]);

  const removeItem = (indexToRemove) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const filteredInvoiceItems = invoiceItems.filter((it) => it.itemId);
    const payload = {
      workName,
      workCode,
      to,
      from,
      date,
      total: grandTotal,
      items: filteredInvoiceItems
        .map((it) => ({
          item: it.itemId,
          qty: Number(it.qty),
          sgst: it.sgst,
          cgst: it.cgst,
        }))
        .filter((it) => it.item),
      notes,
    };
    if (payload.items.length === 0) {
      alert("Please add at least one valid item to the invoice.");
      setIsSubmitting(false);
      return;
    }
    try {
      if (isEditMode) {
        const { data } = await Axios.put(
          `/invoices/${invoiceToEdit._id}`,
          payload
        );
        onUpdated?.(data.invoice);
      } else {
        const { data } = await Axios.post("/invoices", payload);
        onCreated?.(data.invoice);
      }
      onClose();
    } catch (err) {
      console.error("Submit invoice error:", err);
      alert(
        err?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} invoice.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mx-auto border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b pb-6 border-gray-100">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isEditMode ? "Edit Invoice" : "Create Invoice"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Modify the details of your invoice below."
                : "Fill out the form to generate a new invoice."}
            </p>
          </div>
          <Input
            id="date"
            label="Invoice Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-44"
          />
        </div>

        {/* Client Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            id="from"
            label="Bill From"
            required
            value={company.name}
            onChange={(e) => {
              const selectedCompany = companies.find(
                (comp) => comp.name === e.target.value
              );
              setCompany(selectedCompany);
            }}
            className="bg-gray-50"
          >
            <option value="" disabled>
              Select your company...
            </option>
            {companies.map((company, idx) => (
              <option key={idx} value={company.name}>
                {company.name}
              </option>
            ))}
          </Select>
          <Input
            id="client"
            label="Bill To"
            type="text"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Client Name or Company"
            className="bg-gray-50"
          />
          <Input
            id="workName"
            label="Work Name"
            type="text"
            required
            value={workName}
            onChange={(e) => setWorkName(e.target.value)}
            placeholder="e.g., Website Redesign"
            className="bg-gray-50"
          />
          <Input
            id="workCode"
            label="Work Code"
            type="text"
            required
            value={workCode}
            onChange={(e) => setWorkCode(e.target.value)}
            placeholder="e.g., WEB-001"
            className="bg-gray-50"
          />
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Invoice Items
            </h3>
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="text-gray-100 bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-200"
            >
              <span className="mr-1 text-xl font-bold">+</span> Add Item
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50/50">
            {/* --- CHANGE START: Updated table headers to match invoice image --- */}
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
            {/* --- CHANGE END --- */}

            <div className="divide-y divide-gray-200">
              {invoiceItems.map((it, index) => {
                // --- CHANGE START: More explicit calculations to match image columns ---
                const itemSubtotal = (it.price || 0) * (it.qty || 0);
                const itemSgstValue = itemSubtotal * ((it.sgst || 0) / 100);
                const itemCgstValue = itemSubtotal * ((it.cgst || 0) / 100);
                const itemTotal = itemSubtotal + itemSgstValue + itemCgstValue;
                // --- CHANGE END ---

                const isExistingItem = isEditMode && it.uploaded;

                return (
                  <div
                    key={index}
                    // --- CHANGE START: Grid layout updated for new columns ---
                    className={`grid grid-cols-12 items-center gap-x-4 gap-y-2 px-4 py-3 text-sm border-b transition ${
                      isExistingItem
                        ? "bg-green-50/50"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-gray-100`}
                    // --- CHANGE END ---
                  >
                    {/* Item Select */}
                    <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
                      <select
                        id={`item-name-${index}`}
                        value={it.itemId || ""}
                        onChange={(e) =>
                          handleItemSelect(index, e.target.value)
                        }
                        required
                        className={`w-full rounded-md border bg-white px-3 py-2 text-gray-800 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition ${
                          isExistingItem
                            ? "border-green-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="" disabled>
                          {isLoadingItems
                            ? "Loading items..."
                            : "Select item..."}
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
                        onChange={(e) => updateItemQty(index, e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-center text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                      />
                    </div>

                    {/* Rate */}
                    <div className="col-span-8 sm:col-span-2 text-right text-gray-700 font-medium">
                      {formatCurrency(it.price)}
                    </div>

                    {/* --- NEW: Total (Subtotal) Column --- */}
                    <div className="col-span-4 sm:col-span-2 text-right text-gray-800 font-medium">
                      {formatCurrency(itemSubtotal)}
                    </div>

                    {/* SGST (₹ value) */}
                    <div className="col-span-4 sm:col-span-1 text-right text-gray-600">
                      {formatCurrency(itemSgstValue)}
                    </div>

                    {/* CGST (₹ value) */}
                    <div className="col-span-4 sm:col-span-1 text-right text-gray-600">
                      {formatCurrency(itemCgstValue)}
                    </div>

                    {/* Total Amount */}
                    <div className="col-span-4 sm:col-span-1 text-right font-semibold text-indigo-700">
                      {formatCurrency(itemTotal)}
                    </div>

                    {/* Delete button */}
                    <div className="col-span-12 sm:col-span-1 flex justify-center sm:justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
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

        {/* Totals & Notes Section */}
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            <Textarea
              id="notes"
              label="Notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or payment terms..."
              className="bg-gray-50"
            />
          </div>
          <div className="flex-1 max-w-xs ml-auto">
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || isLoadingItems}
            className="font-semibold px-6 py-2"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Invoice"
              : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
