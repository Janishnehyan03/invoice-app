import { useCallback, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import ItemForm from "../components/items/ItemForm";
import ItemList from "../components/items/ItemList";
import { Modal } from "../components/ui/Modal";

/**
 * Separate, self-contained ItemModal component for item creation/editing.
 * No imports from other modals or UI frameworks; defined inline for this file only.
 */
function ItemModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-colors"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

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

  const handleOpenModal = (item = null) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentItem(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentItem) {
        // Update item
        await Axios.put(`/items/${currentItem._id}`, formData);
      } else {
        // Create new item
        await Axios.post("/items", formData);
      }
      handleCloseModal();
      fetchItems(); // Refetch items to see the changes
    } catch (err) {
      setError("Failed to save the item.");
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await Axios.delete(`/items/${itemId}`);
        setItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      } catch (err) {
        setError("Failed to delete the item.");
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Item Management
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition"
          >
            Add New Item
          </button>
        </header>

        <main>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          )}
          {error && (
            <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
              {error}
            </p>
          )}

          {!loading && !error && (
            <ItemList
              items={items}
              onEdit={handleOpenModal}
              onDelete={handleDeleteItem}
            />
          )}
        </main>
      </div>

      {/* Use the self-contained ItemModal here */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentItem ? "Edit Item" : "Create New Item"}
      >
        <ItemForm
          itemToEdit={currentItem}
          onFormSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </ItemModal>
    </div>
  );
}

export default Items;