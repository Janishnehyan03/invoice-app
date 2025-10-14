import { useEffect, useState } from "react";

const initialFormState = {
  name: "",
  phone: "",
  address: "",
};

export default function CustomerForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialFormState);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const formFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "e.g., Anjali Sharma",
    },

    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "e.g., +91 98765 43210",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "e.g., 123 Tech Park, Bangalore",
    },
  ];

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isEditing ? "Edit Customer" : "Add New Customer"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {formFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          >
            {isEditing ? "Save Changes" : "Add Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
