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
      {/* Label */}
      <label
        htmlFor="client-search"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Bill To
      </label>

      {/* Input Field */}
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
        autoComplete="off"
        className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 
      placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 
      shadow-sm hover:border-gray-300 transition-all duration-200"
      />

      {/* Selected Client Info */}
      {selectedClient && (
        <div className="mt-3 px-4 py-3 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl shadow-sm text-sm text-gray-700 flex flex-wrap gap-1 leading-relaxed">
          <div>
            <span className="font-semibold text-indigo-700">Selected:</span>{" "}
            {selectedClient.name}
          </div>
          {selectedClient.phone && (
            <>
              <span className="mx-1 text-gray-400">|</span>
              <span>{selectedClient.phone}</span>
            </>
          )}
          {selectedClient.address && (
            <>
              <span className="mx-1 text-gray-400">|</span>
              <span className="whitespace-pre-line">
                {selectedClient.address}
              </span>
            </>
          )}
        </div>
      )}

      {/* Dropdown List */}
      {isClientDropdownOpen && clientSearchQuery && (
        <ul
          ref={dropdownRef}
          className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto ring-1 ring-gray-100 animate-fadeIn"
        >
          {filteredClients.length > 0 ? (
            filteredClients.map((client, idx) => (
              <li
                key={client._id}
                onClick={() => handleSelectClient(client)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-4 py-3 cursor-pointer text-sm flex flex-col border-b border-gray-50 transition-all duration-150 ${
                  highlightedIndex === idx
                    ? "bg-indigo-50/90 text-indigo-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <p className="font-medium">{client.name}</p>
                <p className="text-xs text-gray-500">{client.phone}</p>
              </li>
            ))
          ) : (
            <li
              className="px-4 py-3 text-center cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium hover:from-indigo-700 hover:to-indigo-600 transition-colors"
              onClick={handleAddNewClientClick}
            >
              + Add “{clientSearchQuery}” as a new client
            </li>
          )}
        </ul>
      )}

      {/* Add New Client Form */}
      {showAddClientForm && (
        <div className="mt-5 p-6 border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white rounded-2xl shadow-sm space-y-4 animate-fadeIn">
          <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Add New Client
          </h4>

          <div className="space-y-4">
            <Input
              id="new-client-name"
              label="Client Name"
              type="text"
              required
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              placeholder="Enter client name"
              onKeyDown={(e) => e.key === "Enter" && handleSaveNewClient(e)}
              className="bg-white/70 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <Input
              id="new-client-phone"
              label="Phone Number"
              type="text"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              placeholder="Client phone number"
              className="bg-white/70 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <Textarea
              id="new-client-address"
              label="Address"
              rows={2}
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              placeholder="Client address"
              className="bg-white/70 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddClientForm(false)}
                className="text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isAddingClient}
                onClick={handleSaveNewClient}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg px-5 py-2 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
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
