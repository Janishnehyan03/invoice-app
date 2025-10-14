import { useEffect, useState, useCallback } from "react";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import Axios from "../utils/Axios";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerForm from "../components/customers/CustomerForm";
import { Modal } from "../components/ui/Modal"; // Your existing generic modal component

// A reusable, styled confirmation modal to replace window.confirm()
const ConfirmationModal = ({ isOpen, onClose, onConfirm, clientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6 animate-fadeIn">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:mx-0">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Delete Customer
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{clientName}</strong>?
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
          >
            Confirm Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Customers() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/clients");
      setClients(res.data);
    } catch (err) {
      toast.error("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleOpenModal = (client = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    const isEditing = !!editingClient;
    const promise = isEditing
      ? Axios.put(`/clients/${editingClient._id}`, formData)
      : Axios.post("/clients", formData);

    try {
      await toast.promise(promise, {
        loading: isEditing ? "Updating customer..." : "Adding customer...",
        success: `Customer ${isEditing ? "updated" : "added"} successfully!`,
        error: `Failed to ${isEditing ? "update" : "add"} customer.`,
      });
      handleCloseModal();
      fetchClients(); // Refresh data from server
    } catch (err) {
      // Toast will automatically handle the error message
      console.error(err);
    }
  };

  const handleOpenDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await Axios.delete(`/clients/${clientToDelete._id}`);
      // Optimistic UI update for instant feedback
      setClients((prevClients) =>
        prevClients.filter((c) => c._id !== clientToDelete._id)
      );
      toast.success("Customer deleted.");
    } catch {
      toast.error("Failed to delete customer.");
    } finally {
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Customers
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Customer</span>
        </button>
      </header>

      <main>
        <CustomerTable
          clients={clients}
          isLoading={loading}
          onEdit={handleOpenModal}
          onDelete={handleOpenDeleteModal}
        />
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? "Edit Customer" : "Add New Customer"}
      >
        <CustomerForm
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        clientName={clientToDelete?.name}
      />
    </div>
  );
}
