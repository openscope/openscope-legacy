
var util = require('../util.js');
var events = require('../events.js');
var turf = require('turf');

class Aircraft extends events.Events {

  // `options`, if present, is an object.
  //
  // ```js
  // {
  //   callsign: 'SP-LRB',
  //   model: 'B788'
  // }
  // ```

  constructor(options) {
    options = options || {};

    super();

    this.callsign = util.getValue(options, 'callsign', new Error('expected aircraft callsign'));
    this.model = util.getValue(options, 'model', new Error('expected aircraft model'));

    this.position = util.getValue(options, 'position', [-122, 37]);
    this.altitude = util.getValue(options, 'altitude', 0);

    // Heading, in radians, clockwise from real north
    this.heading = util.getValue(options, 'heading', 0);
  }

  // `bounds` is a Mapbox GL JS `LngLatBounds` object.
  withinBounds(bounds) {
    if(!bounds) return true;
    if(this.position[0] < bounds.getWest() ||
       this.position[1] < bounds.getSouth() ||
       this.position[0] > bounds.getEast() ||
       this.position[1] > bounds.getNorth()) return false;
    return true;
  }

  setAirspace(options) {
    
  }

  tickPosition(elapsed) {
    
    var destination = turf.destination(turf.point(this.position), 102 * elapsed, util.degrees(this.heading), 'meters');

    this.position = destination.geometry.coordinates;
  }

  tick(elapsed) {
    this.tickPosition(elapsed);
  }

}

exports.Aircraft = Aircraft;
