import React from 'react';
import PropTypes from 'prop-types';

// Reusable Modal Component
const Modal = ({ title, children, onClose, styles }) => {

  // Keydown handler for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Prevent modal closing when clicking inside content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // If no styles are passed, use default class names (or handle differently)
  const overlayClass = styles?.modalOverlay || 'modal-overlay-default';
  const contentClass = styles?.modalContent || 'modal-content-default';
  const closeButtonClass = styles?.modalCloseButton || 'modal-close-button-default';

  return (
    <div
      className={overlayClass}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-label={title ? undefined : "Modal dialog"}
    >
      <div 
        className={contentClass} 
        onClick={handleContentClick}
        role="document"
      >
        {title && <h2 id="modal-title">{title}</h2>}
        <button 
          className={closeButtonClass} 
          onClick={onClose} 
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string, // Title is optional
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  styles: PropTypes.object, // Pass styles object for CSS Modules
};

export default Modal; 