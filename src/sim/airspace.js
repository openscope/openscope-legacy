
var util = require('../util.js');
var events = require('../events.js');

var aircraft = require('./aircraft.js');

class Airspace extends events.Events {

  // `options`, if present, is an object.
  //
  // ```js
  // {
  //
  // }
  // ```

  constructor(options) {
    options = options || {};

    super();

    this.aircraft = [];

    this.initDemoAircraft();
  }

  initDemoAircraft() {

    function randrange() {
      return util.lerp(0, Math.random(), 1, -0.2, 0.2);
    }
    
    for(var i=0; i<100; i++) {
      this.addAircraft(new aircraft.Aircraft({
        callsign: 'VX0001',
        model: 'foo',
        position: [-122.366978 + randrange(), 37.627525 + randrange()],
        altitude: util.lerp(0, Math.random(), 1, 100, 10000)
      }));
    }
  }

  addAircraft(aircraft) {
    aircraft.setAirspace(this);

    this.aircraft.push(aircraft);
  }

  getVisibleAircraft() {
    return this.aircraft;
  }

  tick() {
    
  }

}

exports.Airspace = Airspace;
