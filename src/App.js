import React, { Component } from 'react';
import './App.css';

import DataList from './containers/DataList';
import Form from './containers/Form';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Header
        </header>
        <DataList />
        <br/>
        <Form />
      </div>
    );
  }
}

export default App;
