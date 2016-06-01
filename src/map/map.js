
require('./style/map.less');

var $ = require('jquery');
var mapboxgl = require('mapbox-gl');

var util = require('../util.js');
var events = require('../events.js');

var airspace_layer = require('../sim/airspace_layer.js');

// This is my Mapbox access token. Don't use it for your own projects;
// instead, go to [Mapbox's](https://www.mapbox.com/) website, create
// an account, and use that access token instead.

mapboxgl.accessToken = 'pk.eyJ1IjoiemxzYSIsImEiOiJuOGtheTRvIn0.nARpggDJzduPw-dkchKRpQ';

class Map extends events.Events {

  // `options`, if present, is an object.
  //
  // ```js
  // {
  //   app: app
  // }
  // ```

  constructor(options) {
    options = options || {};

    super();

    this.app = util.getValue(options, 'app', new Error('app key not present in map options'));
    
    this.element = $('<div></div>');
    this.element.attr('id', 'map');

    this.container = $('<div></div>');
    this.container.addClass('map-container');
    
    this.element.append(this.container);

    // Create the map object.

    try {
      this.map = new mapboxgl.Map({
        container: this.container.get(0),
        center: [-122.3790, 37.6213],
        zoom: 12,
        attributionControl: false,
        style: 'mapbox://styles/zlsa/cio4ufiti005qaengdlqomsz5'
      });
    } catch(e) {
      this.app.setLoadingError("Your computer doesn't support WebGL. Try using Google Chrome instead.");
      return;
    }

    this.app.setLoadingMessage('Downloading map data');

    this.map.transform.altitude = 2;

    // Set up map load handler.
    
    this.map.on('load', util.withScope(this, function() {
      this.app.setLoadingMessage('Ready to roll');
      this.fire('loaded');
    }));

    // Set up error handler.
    
    this.map.on('error', util.withScope(this, function() {
      console.log(arguments);
      this.app.setLoadingError('Something went wrong');
    }));
    
    setTimeout(util.withScope(this, function() {
      this.map.resize();
    }), 0);

    this.initAirspaceLayer();

  }
  
  initAirspaceLayer() {
    this.airspace_layer = new airspace_layer.AirspaceLayer(this, this.app.airspace);

    this.element.append(this.airspace_layer.element);
    
    this.map.on('render', util.withScope(this.airspace_layer, this.airspace_layer.render));
  }

}

exports.Map = Map;

