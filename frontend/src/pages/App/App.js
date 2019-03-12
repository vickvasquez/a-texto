import React, { Component } from 'react';

import Add from '~pages/Add';
import Recordings from '~pages/Recordings';
import api from '~api';

import './style.scss';

class App extends Component {
  state = {
    data: [],
  }

  async componentWillMount() {
    try {
      const { data } = await api.getAll();
      this.setState({ data });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div styleName="container">
        <div styleName="container-app">
          <Add />
          {data.length && (
            <Recordings data={data} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
