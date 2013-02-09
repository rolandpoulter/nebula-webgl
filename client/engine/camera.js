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


	camera.lookAt = function (eye, center, up) {
		matrix.lookAt(camera.view, eye, center, up);

		return camera;
	};


	camera.matrix = function (model) {
		var model_view = matrix.multiply(new Float32Array(16), model || matrix.create(), camera.view);

		return matrix.multiply(new Float32Array(16), camera.projection, model_view);
	};

	return camera;
};
