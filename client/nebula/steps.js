"use strict";


exports.init = function (nebula) {
	var steps = {},
	    engine = nebula.engine,
	    camera = engine.camera,
	    matrix = engine.math.mat4,
	    vector = engine.math.vec3;

	var impressDom = document.getElementById('impress');

	var lastX,
	    lastY,
	    lastZ;

	impressDom.addEventListener('impress:beforestepenter', function (e) {
		var currentState = e.detail.currentState,
		    duration = e.detail.duration,
		    position = camera.position,
		    up = camera.up;

		var step = e.target || e.srcElement,
		    data = step.dataset;


		function deg2rad (deg) {return deg * (Math.PI / 180);}

		console.log(currentState.rotate);
		var m = matrix.create();
		matrix.rotateZ(m, m, deg2rad(currentState.rotate.z));
		matrix.rotateY(m, m, deg2rad(currentState.rotate.y));
		matrix.rotateX(m, m, deg2rad(currentState.rotate.x));

		var last = position.slice(0),
		    l = up.slice(0);

		var next = [
			currentState.translate.x / 250,
			currentState.translate.y / 250 + 10,
			currentState.translate.z / 250 + 10
		];
		var n = vector.transformMat4([], l, m);


		var diff = [
			next[0] - last[0],
			next[1] - last[1],
			next[2] - last[2],
		];
		var d = [n[0] - l[0], n[1] - l[1], n[2] - l[2]];

		if (duration === 0) {
			position[0] = next[0];
			position[1] = next[1];
			position[2] = next[2];

		} else {
			animate(duration, function (ratio) {
				position[0] = last[0] + (diff[0] * ratio);
				position[1] = last[1] + (diff[1] * ratio);
				position[2] = last[2] + (diff[2] * ratio);
				up[0] = l[0] + (d[0] * ratio);
				up[1] = l[1] + (d[1] * ratio);
				up[2] = l[2] + (d[2] * ratio);
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
