import { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { SlClose } from 'react-icons/sl';
import css from './modal.module.css';

const modalRootEl = document.getElementById('modal-root');

class Modal extends Component {
  static propTypes={
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleClose);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleClose);
  }

  handleClose = ({ target, currentTarget, code }) => {
    if (target === currentTarget || code === 'Escape') {
      this.props.onClose();
    }
  };

  render() {
    const { children, onClose } = this.props;
    return createPortal(
      <div className={css.overlay} onClick={this.handleClose}>
        <div className={css.modal}>
          <button className={css.button} type="button" onClick={onClose}>
            <SlClose className={css.icon} />
          </button>
          {children}
        </div>
      </div>,
      modalRootEl
    );
  }
}

export default Modal;
