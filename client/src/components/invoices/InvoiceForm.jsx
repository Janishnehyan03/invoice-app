import { useEffect, useMemo, useState } from "react";
import Axios from "../../utils/Axios";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { Select } from "../ui/Select";
import { ClientSearch } from "./ClientSearch";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { TotalsBox } from "./TotalsBox";

// Helper
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const companies = [
  {
    name: "Aneesh kandoth kandiyil",
    address: "Cherapuram PO\n+91 97458 34089",
    mobile: "9745834089",
    gstin: "32CXSPA4511R1Z6",
  },
  {
    name: "Asees Nelliyullathil",
    address: "Cherapuram PO\n+91 97458 34089",
    mobile: "9747807594",
    gstin: "32AWHPN0956D1ZS",
  },
  {
    name: "Shelter Architects and Builders",
    address:
      "Vadakara Road Theekkuni\nOpposite Akshaya Centre\n9747807594,9544260713",
    mobile: "9999999999",
    gstin: "_",
  },
];

export function InvoiceForm({
  onCreated,
  onUpdated,
  onClose,
  invoiceToEdit = null,
}) {
  // --- STATE ---
  const [company, setCompany] = useState(companies[0]);
  const [workName, setWorkName] = useState("");
  const [workCode, setWorkCode] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [client, setClient] = useState("");
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
    Axios.get("/items")
      .then((res) => setAvailableItems(res.data || []))
      .catch(console.error)
      .finally(() => setIsLoadingItems(false));
    Axios.get("/clients")
      .then((res) => setAllClients(res.data || []))
      .catch(console.error);
  }, []);

  // Hydrate on edit
  useEffect(() => {
    if (isEditMode && invoiceToEdit) {
      // Prevent running this logic until async data is loaded
      if (availableItems.length === 0 || allClients.length === 0) {
        return;
      }

      // Set the "Bill From" company based on invoice data
      const fromCompany = companies.find(
        (c) => c.name === invoiceToEdit.from.name
      );
      if (fromCompany) {
        setCompany(fromCompany);
      }

      setWorkName(invoiceToEdit.workName);
      setWorkCode(invoiceToEdit.workCode || "");
      const clientId = invoiceToEdit.to?._id || invoiceToEdit.to;
      setClient(clientId);
      setDate(new Date(invoiceToEdit.date).toISOString().substring(0, 10));
      setNotes(invoiceToEdit.notes || "");

      // Populate the "Bill To" section correctly
      const clientToSet = allClients.find((c) => c._id === clientId);
      if (clientToSet) {
        setSelectedClient(clientToSet);
        setClientSearchQuery(clientToSet.name); // Also populate the search input text
      }

      setInvoiceItems(
        invoiceToEdit.items.map((itemOnInvoice) => {
          let itemId = itemOnInvoice.item?._id || itemOnInvoice.item;
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
      // Reset form when switching from edit to create mode
      setWorkName("");
      setWorkCode("");
      setClient("");
      setSelectedClient(null);
      setClientSearchQuery("");
      setCompany(companies[0]);
      setDate(new Date().toISOString().substring(0, 10));
      setNotes("");
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
  }, [invoiceToEdit, isEditMode, availableItems, allClients]);

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

  // --- FIX: Correctly handle adding a new client ---
  const handleAddNewClient = (newClient) => {
    setAllClients((prevClients) => [...prevClients, newClient]);
    setSelectedClient(newClient);
    setClient(newClient._id);
    setClientSearchQuery(newClient.name);
  };

  // --- HANDLERS ---
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

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client) {
      alert("Please select or add a client for 'Bill To'.");
      return;
    }
    setIsSubmitting(true);
    const filteredInvoiceItems = invoiceItems.filter((it) => it.itemId);
    const payload = {
      workName,
      workCode,
      client,
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
      alert(
        err?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} invoice.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER ---
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
          <ClientSearch
            allClients={allClients}
            clientSearchQuery={clientSearchQuery}
            setClientSearchQuery={setClientSearchQuery}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            value={client}
            setValue={setClient}
            isEditMode={isEditMode}
            onAddClient={handleAddNewClient}
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
        <InvoiceItemsTable
          invoiceItems={invoiceItems}
          availableItems={availableItems}
          isLoadingItems={isLoadingItems}
          isEditMode={isEditMode}
          onItemSelect={handleItemSelect}
          onQtyChange={updateItemQty}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          formatCurrency={formatCurrency}
        />
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
            <TotalsBox
              subtotal={subtotal}
              totalSgst={totalSgst}
              totalCgst={totalCgst}
              grandTotal={grandTotal}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
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
