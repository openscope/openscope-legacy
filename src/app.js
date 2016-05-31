
var $ = require('jquery');

var util = require('./util.js');
var events = require('./events.js');

var airspace = require('./sim/airspace.js');
var map = require('./map/map.js');

class App extends events.Events {

  constructor() {
    super();

    this.loadingError = false;

    this.airspace = new airspace.Airspace();

    this.last = util.time();
    
    $(document).ready(util.withScope(this, this.start));
  }

  setLoadingMessage(message) {
    if(this.loadingError) return;
    
    $('#loading .message').text(message);
  }

  setLoadingError(message) {
    this.setLoadingMessage(message);
    
    this.loadingError = true;
    $('body').addClass('error');
  }

  start() {
    this.setLoadingMessage('Creating map');
    
    this.map = new map.Map({
      app: this
    });

    $('#map-container').append(this.map.element);

    this.map.on('loaded', util.withScope(this, this.loaded));
  }

  loaded() {
    $('body').addClass('loaded');

    this.last = util.time();
    this.tick();
  }

  tick() {
    var now = util.time();
    this.elapsed = now - this.last;

    this.airspace.tick();
    
    this.last = now;
    requestAnimationFrame(util.withScope(this, this.tick));
  }

}

exports.App = App;
