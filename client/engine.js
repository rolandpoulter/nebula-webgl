var glMatrix = require('gl-matrix');


var canvas = require('./engine/canvas'),
    camera = require('./engine/camera');


var texture = require('./engine/manager/texture'),
    shader = require('./engine/manager/shader'),
    buffer = require('./engine/manager/buffer'),
    mesh = require('./engine/manager/mesh');


exports.init = function (parent) {
	var engine = {};


	engine.math = glMatrix;


	engine.canvas = canvas.init(parent);
	engine.camera = camera.init(engine);

	engine.gl = engine.canvas.gl;


	engine.texture = texture.init(engine);
	engine.buffer = buffer.init(engine);
	engine.shader = shader.init(engine);
	engine.mesh = mesh.init(engine);


	engine.requestFrame =
		window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {return setTimeout(callback, 16);}


	engine.cancelFrame =
		window.cancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		window.webkitCancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame || 
		function (timer) {return clearTimeout(timer);}


	engine.startTime = function () {
		return window.mozAnimationStartTime || Date.now();
	};


	engine.renderWhile = function (callback) {
		var start;

		function step (now) {
			start = start || engine.startTime();
			if (callback(now, start)) engine.requestFrame(step);
		}

		step();

		return engine;
	};


	return engine;
};
