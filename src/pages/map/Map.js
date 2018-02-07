import React, { Component } from 'react'
import _ from 'lodash'
import logo from './../../logo.svg'
import './Map.css'
import objectify from 'geoposition-to-object'

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Browser spypage</h1>
        </header>
        <div className="App-intro">
          <div className="block-of-api">
            <h2>Map</h2>
          </div>
        </div>
      </div>
    )
  }
}

export default Map
