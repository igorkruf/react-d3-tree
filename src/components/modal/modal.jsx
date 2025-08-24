
import { useEffect } from 'react';
// import Portal from '../portal/portal.jsx';
import './Modal.css'; // Стили для модалки

export default function Modal({ isOpen, onClose, children, level = 0 }) {
  useEffect(() => {
    console.log('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\')
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    return () => {
      if (document.querySelectorAll('.modal-overlay').length === 0) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 + level * 2 }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{cursor:"default", zIndex: 1001 + level * 2 }}>
          <div className="modal-close" onClick={onClose}> &times;</div>
          {children}
        </div>
      </div>
    
  );
}