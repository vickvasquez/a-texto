import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class ModalFooter extends PureComponent {
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
      <footer styleName="modal-footer" className={className}>
        {children}
      </footer>
    );
  }
}

export default ModalFooter;
