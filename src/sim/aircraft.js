
var util = require('../util.js');
var events = require('../events.js');

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
  }

  setAirspace(options) {
    
  }

}

exports.Aircraft = Aircraft;
