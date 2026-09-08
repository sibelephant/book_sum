import React from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmationDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      actions={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            loadingText="Deleting…"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="modal-message">{message}</p>
    </Modal>
  );
}