export function Select({ id, label, children, ...props }) {
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
