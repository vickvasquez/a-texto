import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class Modal extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    width: PropTypes.number,
    focusInput: PropTypes.bool,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    id: 'modal',
    className: '',
    width: 490,
    focusInput: true,
    loading: false,
  }

  componentDidMount() {
    const { focusInput } = this.props;
    const { modalContent } = this;

    if (focusInput) {
      const inputs = modalContent.querySelectorAll('input[type=text]') || [];
      if (inputs.length > 0) {
        inputs[0].focus();
      }
    }

    const scrollContainer = document.getElementById('scroll');
    const bodyClasses = scrollContainer ? scrollContainer.className : '';
    if (scrollContainer) {
      scrollContainer.className = `${bodyClasses} has-modal`;
    }
  }

  componentWillUnmount() {
    const scrollContainer = document.getElementById('scroll');

    if (scrollContainer) {
      const bodyClasses = scrollContainer.className;
      const regex = /has-modal/ig;

      scrollContainer.className = bodyClasses.replace(regex, '');
    }
  }

  setModalContentRed = (ele) => {
    this.modalContent = ele;
  }

  render() {
    const {
      id,
      className,
      children,
      width,
      loading,
    } = this.props;
    const style = { width };

    return (
      <div styleName="modal" className={className} id={id}>
        <div styleName="modal-overlay" />
        <div styleName="modal-view">
          <div styleName="modal-container" style={style} ref={this.setModalContentRed}>
            {loading && (<div styleName="container-spinner"><i styleName="spinner" /></div>)}
            {!loading && (<div>{children}</div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
