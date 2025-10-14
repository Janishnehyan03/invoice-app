import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import Axios from "../../utils/Axios";

/**
 * ClientSearch: Search and select an existing client, or add a new one.
 * 
 * Fixes:
 * - Ensures parent InvoiceForm will always have correct client state after adding new client.
 * - After adding a client, selection is guaranteed for both parent and child.
 * - Avoids duplicate selection logic between parent and child.
 * - Dropdown and form state is robust and predictable.
 * - No nested forms - hydration error fixed.
 */
export function ClientSearch({
  allClients,
  clientSearchQuery,
  setClientSearchQuery,
  selectedClient,
  setSelectedClient,
  onAddClient, // This prop is essential, should set allClients, selectedClient, clientSearchQuery, client in parent!
  value,
  setValue,
  isEditMode,
}) {
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isAddingClient, setIsAddingClient] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isEditMode && selectedClient) {
      setClientSearchQuery(selectedClient.name);
    }
    // eslint-disable-next-line
  }, [isEditMode, selectedClient]);

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return [];
    const query = clientSearchQuery.toLowerCase();
    return allClients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.phone?.includes(query)
    );
  }, [clientSearchQuery, allClients]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [isClientDropdownOpen, clientSearchQuery, filteredClients.length]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setValue(client._id);
    setClientSearchQuery(client.name);
    setIsClientDropdownOpen(false);
    setShowAddClientForm(false);
  };

  const handleAddNewClientClick = () => {
    setNewClient({ name: clientSearchQuery, phone: "", address: "" });
    setShowAddClientForm(true);
    setIsClientDropdownOpen(false);
  };

  const handleCreateClient = async (client) => {
    try {
      const { data } = await Axios.post("/clients", client);
      return data.client;
    } catch (err) {
      alert(err?.response?.data?.message || "Could not save the client.");
      return null;
    }
  };

  // No inner form! Just a button for save.
  const handleSaveNewClient = async (e) => {
    if (e) e.preventDefault();
    if (!newClient.name) {
      alert("Client name is required.");
      return;
    }
    setIsAddingClient(true);
    try {
      const savedClient = await handleCreateClient(newClient);
      if (savedClient) {
        // Parent must handle selection and query state on add.
        onAddClient(savedClient);
        setShowAddClientForm(false);
        setNewClient({ name: "", phone: "", address: "" });
      }
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (!isClientDropdownOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredClients.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredClients[highlightedIndex]) {
        handleSelectClient(filteredClients[highlightedIndex]);
      } else if (clientSearchQuery && filteredClients.length === 0) {
        handleAddNewClientClick();
      }
    }
  };

  useEffect(() => {
    if (!dropdownRef.current) return;
    const children = dropdownRef.current.children;
    if (children[highlightedIndex]) {
      children[highlightedIndex].scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isClientDropdownOpen]);

  return (
    <div className="relative">
      <label
        htmlFor="client-search"
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Bill To
      </label>
      <Input
        id="client-search"
        type="text"
        required={!value}
        value={clientSearchQuery}
        onChange={(e) => {
          const newQuery = e.target.value;
          setClientSearchQuery(newQuery);
          setIsClientDropdownOpen(true);
          if (selectedClient && selectedClient.name !== newQuery) {
            setSelectedClient(null);
            setValue("");
          }
        }}
        onFocus={() => setIsClientDropdownOpen(true)}
        onBlur={() => setTimeout(() => setIsClientDropdownOpen(false), 200)}
        onKeyDown={handleInputKeyDown}
        placeholder="Search client by name or phone..."
        className="bg-gray-50"
        autoComplete="off"
      />
      {selectedClient && (
        <div className="mt-2 p-2 rounded bg-indigo-50 border border-indigo-200 text-sm">
          <strong>Selected Client:</strong> {selectedClient.name}
          {selectedClient.phone && (
            <>
              <span className="mx-2">|</span>
              <span>{selectedClient.phone}</span>
            </>
          )}
          {selectedClient.address && (
            <>
              <span className="mx-2">|</span>
              <span className="whitespace-pre-line">
                {selectedClient.address}
              </span>
            </>
          )}
        </div>
      )}

      {isClientDropdownOpen && clientSearchQuery && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
          ref={dropdownRef}
        >
          {filteredClients.length > 0 ? (
            filteredClients.map((client, idx) => (
              <li
                key={client._id}
                className={`px-4 py-2 cursor-pointer ${
                  highlightedIndex === idx
                    ? "bg-indigo-100"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => handleSelectClient(client)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <p className="font-semibold">{client.name}</p>
                <p className="text-sm text-gray-500">{client.phone}</p>
              </li>
            ))
          ) : (
            <li
              className="px-4 py-3 cursor-pointer text-white bg-indigo-500 hover:bg-indigo-600 font-semibold"
              onClick={handleAddNewClientClick}
            >
              + Add "{clientSearchQuery}" as a new client
            </li>
          )}
        </ul>
      )}

      {showAddClientForm && (
        <div className="mt-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50/50 space-y-3">
          <h4 className="font-semibold text-gray-800">
            Add New Client Details
          </h4>
          {/* Not a form! No nested forms. */}
          <div className="space-y-3">
            <Input
              id="new-client-name"
              label="Client Name"
              type="text"
              required
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              placeholder="Client Name"
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveNewClient(e);
              }}
            />
            <Input
              id="new-client-phone"
              label="Phone Number"
              type="text"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              placeholder="Client Phone"
            />
            <Textarea
              id="new-client-address"
              label="Address"
              rows={2}
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              placeholder="Client Address"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddClientForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isAddingClient}
                onClick={handleSaveNewClient}
              >
                {isAddingClient ? "Saving..." : "Save Client"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}