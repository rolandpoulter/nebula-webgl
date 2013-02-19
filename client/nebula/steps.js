"use strict";


var cubic_bezier = require('cubic-bezier')


exports.init = function (nebula) {
	var steps = {},
	    engine = nebula.engine,
	    camera = engine.camera,
	    orbit = nebula.orbit,
	    matrix = engine.math.mat4,
	    vector = engine.math.vec3;

	var impressDom = document.getElementById('impress'),
	    cancel;

	impressDom.addEventListener('impress:beforestepenter', function (e) {
		var currentState = e.detail.currentState,
		    duration = e.detail.duration,
		    position = orbit.position,
		    rotate = orbit.rotate;

		var lastP = {x: position.x, y: position.y, z: position.z},
		    lastR = {x: rotate.x, y: rotate.y, z: rotate.z},
		    lastS = orbit.scale;

		var nextP = {
			x: currentState.translate.x / 100,
			y: currentState.translate.y / 100,
			z: -currentState.translate.z / 50 + 10
		};

		var nextR = {
			x: currentState.rotate.x,
			y: currentState.rotate.y,
			z: -currentState.rotate.z
		};

		var nextS = currentState.scale;

		var diffP = {
			x: nextP.x - lastP.x,
			y: nextP.y - lastP.y,
			z: nextP.z - lastP.z,
		};

		var diffR = {
			x: nextR.x - lastR.x,
			y: nextR.y - lastR.y,
			z: nextR.z - lastR.z,
		};

		var diffS = nextS - lastS;

		if (duration === 0) {
			position.x = nextP.x;
			position.y = nextP.y;
			position.z = nextP.z;

			rotate.x = nextR.x;
			rotate.y = nextR.y;
			rotate.z = nextR.z;

			orbit.scale = nextS;

		} else {
			if (cancel) cancel();

			cancel = animate(duration, function (ratio) {
				position.x = lastP.x + (diffP.x * ratio);
				position.y = lastP.y + (diffP.y * ratio);
				position.z = lastP.z + (diffP.z * ratio);

				rotate.x = lastR.x + (diffR.x * ratio);
				rotate.y = lastR.y + (diffR.y * ratio);
				rotate.z = lastR.z + (diffR.z * ratio);

				orbit.scale = lastS + (diffS * ratio);
			});
		}
	});

	function animate (duration, callback) {
		var end = Date.now() + duration,
		    ease = cubic_bezier(0.25, 0.1, 0.25, 1, (1000 / 60 / duration) / 4),
		    cancel = false;

		engine.stepWhile(function (now, start) {
			var done = now >= end;

			if (cancel) return false;

			callback(ease(Math.max(0.0, Math.min(1.0, done ? 1.0 : (now - start) / (end - start)))));

			return !done;
		});

		return function () {
			cancel = true;
		}
	}

	return steps;
};
