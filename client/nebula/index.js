"use strict";


var stars = require('./stars'),
    plane = require('./plane'),
    mark = require('./plane');


exports.init = function (engine, callback) {
	var nebula = {},
	    canvas = engine.canvas,
	    gl = engine.gl;

	nebula.engine = engine;


	nebula.stars = stars.init(nebula, finish);
	nebula.plane = plane.init(nebula, finish);
	nebula.makr = mark.init(nebula, finish);


	fullscreen();
	canvas.clear(
		gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
		gl.DEPTH_TEST,
		[0, 0, 0, 1.0]
	);


	nebula.fullscreen = window.onresize = fullscreen;


	finish.count = 0;
	finish.target = 3;

	function finish (error) {
		finish.count += 1;

		if (!finish.error) {
			if (error) {
				finish.error = true;
			}

			if (!finish.error && finish.count === finish.target) {
				nebula.resize = window.onresize = resize;
				nebula.render = render;

				resize();

				if (callback) {
					callback(null, nebula);
				}
			}
		}
	}


	function fullscreen () {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	function resize () {
		fullscreen();
		render();
	}


	function render () {
		// TODO:
		console.log('got here');

		return true;
	}


	return nebula;
};
