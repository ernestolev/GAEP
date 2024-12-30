import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Mi ubicación</h3>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;