import { useMemo, useState } from "react";

const ItemCard = ({ item, onEdit, onDelete }) => {
  const totalPrice = item.price * (1 + (item.sgst + item.cgst) / 100);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col justify-between border border-gray-100">
      {/* Item Details */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mt-2 text-sm">
          Base Price:{" "}
          <span className="font-medium text-gray-900">
            ₹{item.price.toFixed(2)}
          </span>
        </p>
        <div className="flex gap-3 mt-1 text-sm text-gray-500">
          <span>SGST: {item.sgst}%</span>
          <span>|</span>
          <span>CGST: {item.cgst}%</span>
        </div>
        
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => onEdit(item)}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

function ItemList({ items, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  // Efficiently filter items based on search
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        String(item.price).includes(term) ||
        String(item.sgst).includes(term) ||
        String(item.cgst).includes(term)
    );
  }, [items, search]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 flex justify-end">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="w-full max-w-xs border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No items found
          {search ? " for your search." : ". Add one to get started!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;
