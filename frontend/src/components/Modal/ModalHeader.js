import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { Icon } from '..';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

const defaultProps = {
  className: '',
};

function ModalHeader({
  className,
  children,
  onClose,
}) {
  return (
    <header styleName="modal-header" className={className}>
      <div styleName="close">
        <button type="button" id="cross-button" onClick={onClose}>
          <Icon type="close" />
        </button>
      </div>

      <div>
        {children}
      </div>
    </header>
  );
}

ModalHeader.propTypes = propTypes;
ModalHeader.defaultProps = defaultProps;

export default ModalHeader;
