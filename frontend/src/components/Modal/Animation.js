import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CSSTransitionGroup from 'react-addons-css-transition-group';

class ModalAnimation extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <CSSTransitionGroup
        transitionName="modal"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
        transitionEnter
        transitionLeave
      >
        {children}
      </CSSTransitionGroup>
    );
  }
}

export default ModalAnimation;
