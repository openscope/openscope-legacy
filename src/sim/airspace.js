
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
  }

  addAircraft(aircraft) {
    aircraft.setAirspace(this);
  }

  tick() {
    
  }

}

exports.Airspace = Airspace;
