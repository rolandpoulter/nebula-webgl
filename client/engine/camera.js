"use strict";


exports.init = function (engine) {
	var matrix = engine.math.mat4,
	    camera = {};

	camera.view = matrix.create();
	camera.projection = matrix.create();


	camera.orthographic = function (fovy, left, right, bottom, top, near, far) {
		matrix.ortho(camera.projection, left, right, bottom, top, near, far);

		return camera;
	};


	camera.perspective = function (fovy, aspect, near, far) {
		matrix.perspective(camera.projection, fovy, aspect, near, far);

		return camera;
	};


	camera.position = [0, 0, 10];
	camera.target = [0, 0, 0];
	camera.up = [0, 1, 0]

	camera.lookAt = function (eye, center, up) {
		matrix.lookAt(camera.view,
			this.position = eye || this.position,
			this.target = center || this.target,
			this.up = up || this.up
		);

		return camera;
	};


	camera.mvMatrix = function (model) {
		return matrix.multiply(new Float32Array(16), camera.view, model || matrix.create());
	};

	camera.mvpMatrix = function (model) {
		return matrix.multiply(new Float32Array(16), camera.projection, camera.mvMatrix(model));
	};

	return camera;
};
