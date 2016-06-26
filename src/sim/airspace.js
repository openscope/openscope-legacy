
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

    setInterval(util.withScope(this, this.initDemoAircraft), 2000);
  }

  initDemoAircraft() {

    if(this.aircraft.length > 1000) return;

    for(var i=0; i<1; i++) {
      this.addAircraft(new aircraft.Aircraft({
        callsign: 'VX0001',
        model: 'foo',
        position: [-122.366978, 37.627525],
        altitude: util.lerp(0, Math.random(), 1, 100, 10000),
        heading: util.lerp(0, Math.random(), 1, 0, Math.PI * 2)
      }));
    }
  }

  addAircraft(aircraft) {
    aircraft.setAirspace(this);

    this.aircraft.push(aircraft);
  }

  getVisibleAircraft(bounds) {
    var aircraft = [];
    
    for(var i=0; i<this.aircraft.length; i++) {
      if(this.aircraft[i].withinBounds(bounds)) aircraft.push(this.aircraft[i]);
    }
    
    return aircraft;
  }

  tick(elapsed) {
    for(var i=0; i<this.aircraft.length; i++) {
      this.aircraft[i].tick(elapsed);
    }
  }

}

exports.Airspace = Airspace;
