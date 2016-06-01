
var util = require('../util.js');
var events = require('../events.js');

var aircraft = require('./aircraft.js');

class AirspaceLayer extends events.Events {

  constructor(map) {
    super();

    this.map = map;

    
    
    this.aircraft = [];
  }

  render() {
    
  }

}

exports.AirspaceLayer = AirspaceLayer;
