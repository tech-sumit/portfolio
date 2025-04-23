import React from 'react';
import PropTypes from 'prop-types';

// Reusable Modal Component
const Modal = ({ title, children, onClose, styles }) => {

  // Keydown handler for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (event.target === event.currentTarget) {
        onClose();
        event.preventDefault();
      }
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
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
      aria-modal="true" // Indicate it's a modal dialog
    >
      <div className={contentClass} onClick={handleContentClick}>
        {/* Optional: Add a heading role if title is always present */}
        {title && <h2 role="heading" aria-level="2">{title}</h2>}
        <button className={closeButtonClass} onClick={onClose} aria-label="Close">
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