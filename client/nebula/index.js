null;


var planes = require('./planes'),
    stars = require('./stars'),
    mark = require('./mark');


exports.init = function (engine, callback) {
	var nebula = {},
	    canvas = engine.canvas,
	    camera = engine.camera,
	    gl = engine.gl;

	nebula.engine = engine;


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


	nebula.fullscreen = window.onresize = fullscreen;


	nebula.position = [0, 10, 10];


	function finish (error) {
		finish.count += 1;

		if (!finish.error) {
			if (error) {
				finish.error = true;
			}

			if (!finish.error && finish.count === finish.target) {
				nebula.stars.generate();

				nebula.render = render;

				engine.renderWhile(render);

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
		camera.lookAt(
			nebula.position,
			[0.0, 0.0, 0.0],
			[0.0, 1.0, 0.0]
		);

		nebula.stars.render();
		nebula.planes.render();
		nebula.mark.render();

		return true;
	}


	window.onkeydown = function (e) {
		if (nebula.keys[e.keyIdentifier]) {
			nebula.keys[e.keyIdentifier](e.shiftKey);
		}
	};

	nebula.keys = {
		'Up': function (shift) {
			if (shift) {
				nebula.position[2] -= 0.25;
			} else {
				nebula.position[1] += 0.25;
			}
		},
		'Down': function (shift) {
			if (shift) {
				nebula.position[2] += 0.25;
			} else {
				nebula.position[1] -= 0.25;
			}
		},
		'Left': function () {
			nebula.position[0] -= 0.25;
		},
		'Right': function () {
			nebula.position[0] += 0.25;
		}
	}

	window.onmousedown = function (e) {
		var startX = e.clientX,
		    startY = e.clientY;

		window.onmouseup = function () {
			window.onmousemove = null;
		};

		window.onmousemove = function (e) {
			var diffX = e.clientX - startX,
			    diffY = e.clientY - startY;

			if (diffX > 50) {
				nebula.position[0] += 0.1;
			} else if (diffX < 50) {
				nebula.position[0] -= 0.1;
			}

			if (diffY > 50) {
				if (e.shiftKey) {
					nebula.position[2] -= 0.1;
				} else {
					nebula.position[1] += 0.1;
				}
			} else if (diffY < 50) {
				if (e.shiftKey) {
					nebula.position[2] += 0.1;
				} else {
					nebula.position[1] -= 0.1;
				}
			}
		}
	};


	return nebula;
};
