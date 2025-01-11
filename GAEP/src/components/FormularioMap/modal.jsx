import React from 'react';
import './Modal.css';
import img1 from '../../assets/images/img-formmap.png';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Mi ubicación</h3>
                <div className='modal-body'>
                    <img src={img1} alt="" />
                    <button className="modal-close" onClick={onClose}>X</button>
                    {children}
                </div>

            </div>
        </div>
    );
};

export default Modal;