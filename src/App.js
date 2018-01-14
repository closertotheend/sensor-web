import React, { Component } from 'react'
import _ from 'lodash'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        this.setState(() => ({ battery }))
        battery.addEventListener('chargingchange', () => {
          this.setState(() => ({ battery }))
        })
      })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((geo) => {
        this.setState(() => ({ geo }))
      })
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', _.throttle((deviceorientation) => {
        this.setState(() => ({ deviceorientation }))
      }, 2000), false)
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', _.throttle((devicemotion) => {
        this.setState(() => ({ devicemotion }))
      }, 2000), false)
    }

    window.addEventListener('devicelight', (devicelight) => {
      this.setState(() => ({ devicelight }))
    }, false)

    if ('ondeviceproximity' in window) {
      window.addEventListener('deviceproximity', (deviceproximity) => {
        this.setState(() => ({ deviceproximity }))
      })
    }

  }

  isBatterySensorInitialized() {
    return this.state && this.state.battery
  }

  isGeoSensorInitialized() {
    return this.state && this.state.geo
  }

  isDeviceorientationSensorInitialized() {
    return this.state && this.state.deviceorientation
  }

  isDevicemotionSensorInitialized() {
    return this.state && this.state.devicemotion
  }

  isDevicelightSensorInitialized() {
    return this.state && this.state.devicelight
  }

  isDeviceproximitySensorInitialized() {
    return this.state && this.state.deviceproximity
  }

  deviceorientation() {
    return this.state.deviceorientation
  }

  devicemotion() {
    return this.state.devicemotion
  }

  battery() {
    return this.state.battery
  }

  geo() {
    return this.state.geo
  }

  devicelight() {
    return this.state.devicelight
  }

  deviceproximity() {
    return this.state.deviceproximity
  }

  objectToMap(object) {
    return this.objectToMap2(object)
  }

  objectToMap2(object) {
    let map = {}
    for (let key in object) {
      let val = object[key]
      if (!_.isFunction(val)) {
        if (!_.isObject(val)) {
          map[key] = val
        } else {
          if (val === window) {
            return
          }
          map[key] = this.objectToMap2(val)
        }
      }
    }
    return map
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Lauri????????????????????</h1>
        </header>
        <div className="App-intro">

          <div className="block-of-api">
            <h2>Battery sensor</h2>
            <p>Is
              Charging? {this.isBatterySensorInitialized() ? (this.battery().charging ? 'Yes' : 'No') : 'Not initialized yet'}</p>
            <p>chargingTime {this.isBatterySensorInitialized() ? this.battery().chargingTime : 'Not initialized yet'}</p>
            <p>dischargingTime {this.isBatterySensorInitialized() ? this.battery().dischargingTime : 'Not initialized yet'}</p>
            <p>level {this.isBatterySensorInitialized() ? this.battery().level : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Geo sensor</h2>
            <p>Accuracy {this.isGeoSensorInitialized() ? (this.geo().coords.accuracy) : 'Not initialized yet'}</p>
            <p>latitude {this.isGeoSensorInitialized() ? this.geo().coords.latitude : 'Not initialized yet'}</p>
            <p>longitude {this.isGeoSensorInitialized() ? this.geo().coords.longitude : 'Not initialized yet'}</p>
            <p>speed {this.isGeoSensorInitialized() ? this.geo().coords.speed : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Devicemotion sensor</h2>
            <p>x {this.isDevicemotionSensorInitialized() ? (this.devicemotion().acceleration.x) : 'Not initialized yet'}</p>
            <p>y {this.isDevicemotionSensorInitialized() ? this.devicemotion().acceleration.y : 'Not initialized yet'}</p>
            <p>z {this.isDevicemotionSensorInitialized() ? this.devicemotion().acceleration.z : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Deviceorientation sensor</h2>
            <p>absolute {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().absolute : 'Not initialized yet'}</p>
            <p>alpha {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().alpha : 'Not initialized yet'}</p>
            <p>beta {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().beta : 'Not initialized yet'}</p>
            <p>gamma {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().gamma : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Devicelight sensor</h2>
            <p>value {this.isDevicelightSensorInitialized() ? this.devicelight().value : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Deviceproximity sensor</h2>
            <p>value {this.isDeviceproximitySensorInitialized() ? this.deviceproximity().value : 'Not initialized yet'}</p>
            <p>min {this.isDeviceproximitySensorInitialized() ? this.deviceproximity().min : 'Not initialized yet'}</p>
            <p>max {this.isDeviceproximitySensorInitialized() ? this.deviceproximity().max : 'Not initialized yet'}</p>
          </div>


        </div>
      </div>
    )
  }
}

export default App
