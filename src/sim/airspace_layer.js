
var $ = require('jquery');

var util = require('../util.js');
var events = require('../events.js');

var aircraft = require('./aircraft.js');

var twgl = require('twgl.js');

require('./style/airspace-layer.less');

class AirspaceLayer extends events.Events {

  constructor(map) {
    super();

    this.map = map;

    this.element = $('<canvas></canvas>');
    this.element.addClass('airspace-layer');

    this.gl = twgl.getWebGLContext(this.element.get(0), {
      alpha: true
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
      '  gl_Position = vec4(uPosition * uResolutionInverse + aPosition * uResolutionInverse * uRadius * 2.0, 0.5, 1.0);',
      '}'
    ].join('\n'), [
      'precision mediump float;',
      'uniform vec3 uColor;',
      'uniform float uRadius;',
      'varying vec2 vPosition;',
      'void main() {',
      '  float blur = (1.0 / uRadius) * 0.5;',
      '  float alpha = 1.0 - smoothstep(1.0 - blur, 1.0, length(vPosition));',
      '  gl_FragColor = vec4(uColor * alpha, alpha);',
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
  
  render() {
    var gl = this.gl;

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    var pos = this.map.map.project([-122.3790, 37.6213]);

    console.log(pos);

    var uniforms = {
      uTime: util.time() * 0.001,
      uResolutionInverse: [
        1 / gl.canvas.width,
        1 / gl.canvas.height
      ],
      uPosition: [pos.x, pos.y],
      uRadius: 3,
      uColor: [
        112 / 255,
        180 / 255,
        194 / 255
      ]
    };

    gl.useProgram(this.shaders['circle'].program);
    twgl.setBuffersAndAttributes(gl, this.shaders['circle'], this.buffers['square']);
    twgl.setUniforms(this.shaders['circle'], uniforms);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers['square']);
  }

}

exports.AirspaceLayer = AirspaceLayer;
