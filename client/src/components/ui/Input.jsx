export function Input({ id, label, className = '', ...props }) {
  const baseClasses =
    'block w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none placeholder-gray-400 sm:text-sm sm:leading-6';
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({ id, label, className = '', ...props }) {
  const baseClasses =
    'block w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none placeholder-gray-400 sm:text-sm sm:leading-6 resize-none';
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`${baseClasses} ${className}`}
        rows={4}
        {...props}
      />
    </div>
  );
}