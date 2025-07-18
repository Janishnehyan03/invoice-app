import React, { useState, useEffect } from 'react';

function ItemForm({ itemToEdit, onFormSubmit, onCancel }) {
  const initialState = {
    name: '',
    price: '',
    sgst: 0,
    cgst: 0,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        price: itemToEdit.price,
        sgst: itemToEdit.sgst,
        cgst: itemToEdit.cgst,
      });
    } else {
      setFormData(initialState);
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Base Price (₹)</label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="sgst" className="block text-sm font-medium text-gray-700">SGST (%)</label>
          <input
            type="number"
            name="sgst"
            id="sgst"
            value={formData.sgst}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="cgst" className="block text-sm font-medium text-gray-700">CGST (%)</label>
          <input
            type="number"
            name="cgst"
            id="cgst"
            value={formData.cgst}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          {itemToEdit ? 'Update Item' : 'Create Item'}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;