import { useCallback, useEffect, useState } from "react";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Axios from "../utils/Axios";
import ItemForm from "../components/items/ItemForm";
import ItemsTable from "../components/items/ItemsTable";
import { Modal } from "../components/ui/Modal"; // Assuming this is your general modal

// --- A more robust, accessible confirmation modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6 animate-fadeIn">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3
              className="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{children}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/items");
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenFormModal = (item = null) => {
    setCurrentItem(item);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setCurrentItem(null);
    setIsFormModalOpen(false);
  };

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentItem) {
        await Axios.put(`/items/${currentItem._id}`, formData);
      } else {
        await Axios.post("/items", formData);
      }
      handleCloseFormModal();
      fetchItems();
    } catch (err) {
      setError("Failed to save the item.");
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await Axios.delete(`/items/${itemToDelete._id}`);
      // Optimistic UI update
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemToDelete._id)
      );
      handleCloseDeleteModal();
    } catch (err) {
      setError("Failed to delete the item.");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Item Management
          </h1>
          <button
            onClick={() => handleOpenFormModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Item</span>
          </button>
        </header>

        <main>
          {error && (
            <p className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-6">
              {error}
            </p>
          )}

          <ItemsTable
            items={items}
            isLoading={loading}
            onEdit={handleOpenFormModal}
            onDelete={handleOpenDeleteModal}
          />
        </main>
      </div>

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={currentItem ? "Edit Item" : "Create New Item"}
      >
        <ItemForm
          itemToEdit={currentItem}
          onFormSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
      >
        Are you sure you want to delete the item "{itemToDelete?.name}"? This
        action cannot be undone.
      </ConfirmationModal>
    </div>
  );
}

export default Items;
