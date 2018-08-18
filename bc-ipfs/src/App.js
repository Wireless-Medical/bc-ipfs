/*jshint esversion: 6*/
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Grid, Button } from 'react-bootstrap';

import ipfs from './ipfs';

class App extends Component {

  captureFile (event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.onloadend = () => this.saveToIpfs(reader);
    reader.readAsArrayBuffer(file);
  }

  saveToIpfs (reader) {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        this.setState({added_file_hash: ipfsId});
      }).catch((err) => {
        console.error(err);
      })
  }

  /* jshint ignore:start */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>IPFS Registration</h1>
        </header>
        <p className="App-intro">
          To get started, click on button <code>submit</code> to upload files.
        </p>
        <Grid>
          <Button 
              bsStyle="primary" 
              type="submit"> 
              Send it 
          </Button>
        </Grid>
      </div>
    );
  };
  /* jshint ignore:end */
}

export default App;