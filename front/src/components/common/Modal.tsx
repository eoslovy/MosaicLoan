/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '@/styles/common/Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }

    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role='presentation'
      aria-hidden='true'
      aria-label='모달 닫기 배경'
      onClick={onClose}
    >
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type='button'
            onClick={onClose}
            className={styles.closeButton}
            aria-label='모달 닫기'
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
