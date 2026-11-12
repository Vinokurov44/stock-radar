import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import './Modal.css';

// Generic popup: dark overlay, a box with a title and a close button.
// Whatever is written between <Modal> and </Modal> comes in as `children`.
function Modal({ isOpen, title, onClose, children }) {
  // Close on the Escape key while the popup is open.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <IconX size={20} stroke={1.5} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}

export default Modal;
