
var $ = require('jquery');

var util = require('../util.js');
var events = require('../events.js');
var mapboxgl = require('mapbox-gl');

var aircraft = require('./aircraft.js');

var twgl = require('twgl.js');

require('./style/airspace-layer.less');

class AirspaceLayer extends events.Events {

  constructor(map, airspace) {
    super();

    this.map = map;
    this.airspace = airspace;

    this.element = $('<canvas></canvas>');
    this.element.addClass('airspace-layer');

    this.gl = twgl.getWebGLContext(this.element.get(0), {
      //alpha: true,
      //premultipliedAlpha: false
    });

    this.initShaders();
    this.initBuffers();
    
    this.aircraft = [];
  }

  createShader(name, vert, frag) {
    this.shaders[name] = twgl.createProgramInfoFromProgram(this.gl, twgl.createProgramFromSources(this.gl, [
      vert,
      frag
    ]));
  }

  initShaders() {

    this.shaders = {};

    this.createShader('circle', [
      'precision mediump float;',
      'attribute vec2 aPosition;',
      'uniform vec2 uPosition;',
      'uniform vec2 uResolutionInverse;',
      'uniform float uRadius;',
      'varying vec2 vPosition;',
      'void main() {',
      '  vPosition = aPosition;',
      '  vec2 position = vec2(uPosition.x * 2.0 * uResolutionInverse.x - 1.0, 1.0 - (uPosition.y * 2.0 * uResolutionInverse.y));',
      '  gl_Position = vec4(position + aPosition * uResolutionInverse * uRadius * 2.0, 0.5, 1.0);',
      '}'
    ].join('\n'), [
      'precision mediump float;',
      'uniform vec3 uColor;',
      'uniform float uRadius;',
      'uniform float uAlpha;',
      'varying vec2 vPosition;',
      'void main() {',
      '  float blur = (1.0 / uRadius) * 1.0;',
      '  float alpha = 1.0 - smoothstep(1.0 - blur, 1.0, length(vPosition));',
      '  gl_FragColor = vec4(uColor, alpha * uAlpha);',
      '}'
    ].join('\n'));
    
    this.createShader('line', [
      'precision mediump float;',
      'attribute vec2 aPosition;',
      'uniform vec2 uPosition;',
      'uniform vec2 uResolutionInverse;',
      'uniform vec2 uSize;',
      'uniform float uAngle;',
      'uniform float uWidth;',
      'varying vec2 vPosition;',
      'void main() {',
      '  vPosition = aPosition;',
      '  vec2 spos = aPosition * uSize;',
      '  vec2 rotation = vec2(spos.y * sin(uAngle) + spos.x * cos(uAngle), spos.x * sin(uAngle) - spos.y * cos(uAngle));',
      '  vec2 position = vec2(uPosition.x * 2.0 * uResolutionInverse.x - 1.0, 1.0 - (uPosition.y * 2.0 * uResolutionInverse.y));',
      '  position = position + rotation * uResolutionInverse * 2.0;',
      '  gl_Position = vec4(position, 0.5, 1.0);',
      '}'
    ].join('\n'), [
      'precision mediump float;',
      'uniform vec2 uSize;',
      'uniform vec3 uColor;',
      'uniform float uAlpha;',
      'varying vec2 vPosition;',
      'void main() {',
      '  float blurx = (1.0 / uSize.x) * 0.75;',
      '  float blury = (1.0 / uSize.y) * 0.75;',
      '  float alpha = 1.0 - smoothstep(1.0 - blurx, 1.0, abs(vPosition.x));',
      '  alpha *= 1.0 - smoothstep(1.0 - blury, 1.0, abs(vPosition.y));',
      '  gl_FragColor = vec4(uColor, alpha * uAlpha);',
      '}'
    ].join('\n'));
    
  }

  createBuffer(name, arrays) {
    this.buffers[name] = twgl.createBufferInfoFromArrays(this.gl, arrays);
  }

  initBuffers() {
    
    this.buffers = {};

    this.createBuffer('square', {
      aPosition: {
        numComponents: 2,
        data: [
         -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
        ]
      },
    });
    
  }

  drawCircle(position, options) {
    if(!options) options = {};

    var alpha = util.getValue(options, 'alpha', 1);
    if(alpha <= 0) return;
    
    var uniforms = {
      uTime: util.time() * 0.001,
      uResolutionInverse: [
        1 / this.gl.canvas.width,
        1 / this.gl.canvas.height
      ],
      uPosition: position,
      uRadius: util.getValue(options, 'radius', 4),
      uAlpha: alpha,
      uColor: util.getValue(options, 'color', [
        112 / 255,
        180 / 255,
        194 / 255
      ])
    };

    twgl.setUniforms(this.shaders['circle'], uniforms);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.buffers['square']);
  }
  
  drawLine(start, end, options) {
    if(!options) options = {};

    var alpha = util.getValue(options, 'alpha', 1);
    if(alpha <= 0) return;

    var center = [
      (end[0] + start[0]) * 0.5,
      (end[1] + start[1]) * 0.5
    ];

    var length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)) * 0.5;

    var angle = Math.atan2(end[0] - start[0], end[1] - start[1]);

    var uniforms = {
      uTime: util.time() * 0.001,
      uResolutionInverse: [
        1 / this.gl.canvas.width,
        1 / this.gl.canvas.height
      ],
      uSize: [util.getValue(options, 'width', 1), length],
      uAlpha: alpha,
      uAngle: angle,
      uPosition: center,
      uColor: util.getValue(options, 'color', [
        112 / 255,
        180 / 255,
        194 / 255
      ])
    };

    twgl.setUniforms(this.shaders['line'], uniforms);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.buffers['square']);
  }

  startCircles() {
    this.gl.useProgram(this.shaders['circle'].program);
    twgl.setBuffersAndAttributes(this.gl, this.shaders['circle'], this.buffers['square']);
  }
  
  startLines() {
    this.gl.useProgram(this.shaders['line'].program);
    twgl.setBuffersAndAttributes(this.gl, this.shaders['line'], this.buffers['square']);
  }
  
  drawCircleMap(lnglat, options) {
    if(!options) options = {};
    
    var pos = this.map.map.project(lnglat);

    this.drawCircle([pos.x, pos.y], options);

  }
  
  drawLineMap(start, end, options) {
    if(!options) options = {};
    
    start = this.map.map.project(start);
    start = [start.x, start.y];
    
    end = this.map.map.project(end);
    end = [end.x, end.y];

    this.drawLine(start, end, options);

  }
  
  calculateDotInfo(lnglat, altitude, options) {
    if(!options) options = {};

    // When `0`, pitch makes no difference to the altitude (it's
    // always drawn as if the map is tilted); when it's `1`, pitch is
    // taken into account.
    
    var pitchFactor = 1;
    
    var zoom = util.lerp(0, Math.pow(2, this.map.map.getZoom()), Math.pow(2, 20), 0.0, 10);
    var pitch = 1.0 - (Math.cos(util.radians(this.map.map.getPitch())) * pitchFactor);
    var pixel_altitude = pitch * altitude * zoom;
    var pos = this.map.map.project(lnglat);

    var start = [pos.x, pos.y - pixel_altitude];
    var end = [pos.x, pos.y];

    var circleOptions = {};

    var fadeStart = util.getValue(options, 'fadeStart', 6);
    var fadeEnd   = util.getValue(options, 'fadeEnd', 5);

    var alpha = util.clerp(fadeStart, this.map.map.getZoom(), fadeEnd, 1, 0);

    return [start, end, alpha];

  }

  drawDotCircle(info, options) {
    if(!options) options = {};

    options.radius = util.lerp(3, this.map.map.getZoom(), 15, 0, 6);
    options.alpha = info[2];
    
    this.drawCircle([info[0][0], info[0][1]], options);
  }
  
  drawDotLine(info, options) {
    if(!options) options = {};

    options.radius = util.lerp(3, this.map.map.getZoom(), 15, 0, 6);
    options.alpha = info[2];
    
    this.drawLine(info[0], info[1], options);
  }

  drawAircraft() {

    var aircraft = this.airspace.getVisibleAircraft(null);
    
    var dotInfo = [];
    
    for(var i=0; i<aircraft.length; i++) {
      dotInfo.push(this.calculateDotInfo(aircraft[i].position, aircraft[i].altitude));
    }

    this.startCircles();
    for(var i=0; i<dotInfo.length; i++) {
      this.drawDotCircle(dotInfo[i]);
    }
    
    this.startLines();
    for(var i=0; i<dotInfo.length; i++) {
      this.drawDotLine(dotInfo[i]);
    }
    
  }
  
  render() {
    var gl = this.gl;

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawAircraft();
  }

}

exports.AirspaceLayer = AirspaceLayer;
