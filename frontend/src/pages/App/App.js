import React, { Component } from 'react';

import Add from '~pages/Add';
import api from '~api';

import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    const data = await api.getAll();
  }

  render() {

    return (
      <div styleName="container">
        <Add />
      </div>
    );
  }
}

export default App;
