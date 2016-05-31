
require('./style/map.less');

var $ = require('jquery');
var mapboxgl = require('mapbox-gl');

var util = require('../util.js');
var events = require('../events.js');

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
    
    this.map = new mapboxgl.Map({
      container: this.element.get(0),
      style: 'mapbox://styles/zlsa/cio4ufiti005qaengdlqomsz5'
    });

    this.app.setLoadingMessage('Downloading map data');
    
    this.map.on('load', util.withScope(this, function() {
      this.app.setLoadingMessage('Ready to roll');
      this.fire('loaded');
    }));
    
    setTimeout(util.withScope(this, function() {
      this.map.resize();
    }), 0);
    
  }

}

exports.Map = Map;
