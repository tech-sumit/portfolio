import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Reusable Modal Component
const Modal = ({ title, children, onClose, styles }) => {
  const modalRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle overlay keyboard events
  const handleOverlayKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Prevent modal closing when clicking inside content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Handle content keyboard events (for accessibility)
  const handleContentKeyDown = (e) => {
    // Don't close modal when pressing keys inside content
    e.stopPropagation();
  };

  // If no styles are passed, use default class names (or handle differently)
  const overlayClass = styles?.modalOverlay || 'modal-overlay-default';
  const contentClass = styles?.modalContent || 'modal-content-default';
  const closeButtonClass = styles?.modalCloseButton || 'modal-close-button-default';

  return (
    <div
      ref={modalRef}
      className={overlayClass}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-label={title ? undefined : "Modal dialog"}
      tabIndex={-1}
    >
      <div 
        className={contentClass} 
        onClick={handleContentClick}
        onKeyDown={handleContentKeyDown}
        role="document"
        tabIndex={-1}
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