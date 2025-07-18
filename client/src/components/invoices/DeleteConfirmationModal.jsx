// src/components/invoices/DeleteConfirmationModal.jsx
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, invoiceNumber }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-4">
        <p>Are you sure you want to delete invoice <strong>#{invoiceNumber}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Invoice'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}