import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Are you sure?', 
    message = 'This action cannot be undone.', 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // danger, warning, info
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className={styles.container}>
                <div className={`${styles.icon} ${styles[type]}`}>
                    <AlertCircle size={32} />
                </div>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button 
                        className={`${styles.confirmBtn} ${styles[type]}`} 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
