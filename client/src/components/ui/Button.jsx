const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600",
  secondary:
    "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

const iconButtonVariants = {
  primary: "text-indigo-600 hover:text-indigo-900",
  danger: "text-red-500 hover:text-red-700",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <button
      type="button"
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  variant = "primary",
  label,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`rounded-full p-1.5 transition-colors ${iconButtonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
