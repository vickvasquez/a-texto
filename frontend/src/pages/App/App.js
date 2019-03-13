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
    this.getRecordings();
  }

  getRecordings = async () => {
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
          <Add
            refetch={this.getRecordings}
          />
          {data.length > 0 && (
            <Recordings
              refetch={this.getRecordings}
              data={data}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
