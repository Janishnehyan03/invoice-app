import { useEffect } from "react";

const CloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Increased max-w-3xl to max-w-5xl for a wider modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <h2 id="modal-title" className="text-xl font-semibold text-slate-800">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
