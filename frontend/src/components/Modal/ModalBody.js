import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class ModalBody extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const {
      className,
      children,
    } = this.props;

    return (
      <div styleName="modal-body" className={className}>
        {children}
      </div>
    );
  }
}

export default ModalBody;
