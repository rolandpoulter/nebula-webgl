"use strict";


exports.init = function (nebula) {
	var steps = {},
	    engine = nebula.engine,
	    camera = engine.camera,
	    orbit = nebula.orbit,
	    matrix = engine.math.mat4,
	    vector = engine.math.vec3;

	var impressDom = document.getElementById('impress');

	var lastX,
	    lastY,
	    lastZ;

	impressDom.addEventListener('impress:beforestepenter', function (e) {
		var currentState = e.detail.currentState,
		    duration = e.detail.duration,
		    position = orbit.position,
		    rotate = orbit.rotate;
		var last = {
			x: position.x,
			y: position.y,
			z: position.z
		};
		var lastScale = orbit.scale;
		var lastR = {
			x: rotate.x,
			y: rotate.y,
			z: rotate.z
		};
		var next = {
			x: currentState.translate.x / 180,
			y: currentState.translate.y / 180,
			z: -currentState.translate.z / 100 + 10
		};
		var nextScale = currentState.scale;
		var nextR = {
			x: currentState.rotate.x,
			y: currentState.rotate.y,
			z: -currentState.rotate.z
		};
		var diff = {
			x: next.x - last.x,
			y: next.y - last.y,
			z: next.z - last.z,
		};
		var diffScale = nextScale - lastScale;
		var diffR = {
			x: nextR.x - lastR.x,
			y: nextR.y - lastR.y,
			z: nextR.z - lastR.z,
		};
		if (duration === 0) {
			position.x = next.x;
			position.y = next.y;
			position.z = next.z;
			orbit.scale = nextScale;
			rotate.x = nextR.x;
			rotate.y = nextR.y;
			rotate.z = nextR.z;

		} else {
			animate(duration, function (ratio) {
				position.x = last.x + (diff.x * ratio);
				position.y = last.y + (diff.y * ratio);
				position.z = last.z + (diff.z * ratio);
				orbit.scale = lastScale + (diffScale * ratio);
				rotate.x = lastR.x + (diffR.x * ratio);
				rotate.y = lastR.y + (diffR.y * ratio);
				rotate.z = lastR.z + (diffR.z * ratio);
			});
		}
	});

	function animate (duration, callback) {
		var end = Date.now() + duration;

		engine.stepWhile(function (now, start) {
			var done = now >= end;

			callback(Math.max(0.0, Math.min(1.0, done ? 1.0 : (now - start) / (end - start))));

			return !done;
		});
	}

	return steps;
};
