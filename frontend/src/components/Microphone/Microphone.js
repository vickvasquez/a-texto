import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '~components';

import './style.scss';

const props = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
};

const defaultProps = {
  icon: 'microphone',
};

function Recording({ onClick, icon }) {
  return (
    <div styleName="microphone" onClick={onClick}>
      <div styleName="inner-microphone">
        <Icon type={icon} />
      </div>
    </div>
  )
}

Recording.propTypes = props;

Recording.defaultProps = defaultProps;

export default Recording;