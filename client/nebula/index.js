"use struct";


var planes = require('./planes'),
    stars = require('./stars'),
    orbit = require('./orbit'),
    steps = require('./steps'),
    mark = require('./mark');


exports.init = function (engine, callback) {
	var nebula = {},
	    canvas = engine.canvas,
	    camera = engine.camera,
	    gl = engine.gl;

	nebula.engine = engine;


	nebula.orbit = orbit.init(nebula);
	nebula.orbit.toCamera();


	finish.count = 0;
	finish.target = 3;


	nebula.planes = planes.init(nebula, finish);
	nebula.stars = stars.init(nebula, finish);
	nebula.mark = mark.init(nebula, finish);


	fullscreen();
	canvas.clear(
		gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
		null,
		[0, 0, 0, 1.0]
	);


	window.onresize = nebula.fullscreen = fullscreen;


	require('../engine/camera_events').init(engine);
	//nebula.steps = steps.init(nebula);


	function finish (error) {
		finish.count += 1;

		if (!finish.error) {
			if (error) {
				finish.error = true;
			}

			if (!finish.error && finish.count === finish.target) {
				nebula.stars.generate();
				nebula.planes.generate();

				engine.stepWhile(render);

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


	function render () {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		camera.perspective(45, canvas.width / canvas.height, 0.1, 1000.0);

		//nebula.orbit.toCamera();
		camera.lookAt();

		nebula.stars.render();
		nebula.planes.render();
		nebula.mark.render();

		return true;
	}


	return nebula;
};
