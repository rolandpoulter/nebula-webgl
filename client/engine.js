"use strict";


var glMatrix = require('gl-matrix');


var canvas = require('./engine/canvas'),
    camera = require('./engine/camera');


var texture = require('./engine/manager/texture'),
    shader = require('./engine/manager/shader'),
    buffer = require('./engine/manager/buffer');


exports.init = function (parent) {
	var engine = {};


	engine.math = glMatrix;


	engine.canvas = canvas.init(parent);
	engine.camera = camera.init(engine);

	engine.gl = engine.canvas.gl;


	engine.texture = texture.init(engine);
	engine.buffer = buffer.init(engine);
	engine.shader = shader.init(engine);


	engine.requestFrame =
		window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {return setTimeout(callback, 16);}


	engine.stepWhile = function (callback) {
		var start = Date.now();

		step();

		function step () {
			if (callback(Date.now(), start)) {
				engine.requestFrame.call(window, step);
			}
		}

		return engine;
	};


	return engine;
};
