import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { SlClose } from 'react-icons/sl';
import css from './modal.module.css';

const modalRootEl = document.getElementById('modal-root');

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.addEventListener('keydown', handleClose);
    return () => document.body.removeEventListener('keydown', handleClose);
    // eslint-disable-next-line
  }, []);

  const handleClose = ({ target, currentTarget, code }) => {
    if (target === currentTarget || code === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <div className={css.overlay} onClick={handleClose}>
      <div className={css.modal}>
        <button className={css.button} type="button" onClick={onClose}>
          <SlClose className={css.icon} />
        </button>
        {children}
      </div>
    </div>,
    modalRootEl
  );
};

export default Modal;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
