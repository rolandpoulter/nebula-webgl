"use strict";


exports.init = function (nebula) {
	var orbit = {};

	var matrix = nebula.engine.math.mat4,
	    vector = nebula.engine.math.vec3;


	orbit.position = {
		x: 0,
		y: 45,
		z: 10
	};

	orbit.scale = 1;

	orbit.rotate = {
		x: 0,
		y: 0,
		z: 0
	};

	orbit.toCamera = function (camera) {
		camera = camera || nebula.engine.camera;
		var position = [0, 0, -orbit.position.z];
		var m = matrix.create();
		matrix.rotateY(m, m, deg2rad(orbit.position.x));
		matrix.rotateX(m, m, deg2rad(orbit.position.y));
		vector.transformMat4(camera.position, position, m);
		var up = [0, 1, 0];
		var target = [0, 0, 0];
		var v = vector.normalize([], vector.sub([], target, position));
		m = matrix.create();
		matrix.rotate(m, m, deg2rad(orbit.rotate.z), v);
		vector.transformMat4(camera.up, up, m);
		var u = vector.normalize([], camera.up);
		m = matrix.create();
		matrix.rotate(m, m, deg2rad(orbit.rotate.y), u);
		matrix.rotate(m, m, deg2rad(orbit.rotate.x), vector.cross([], v, up));
		vector.transformMat4(camera.target, target, m);
	};

	function deg2rad (deg) {return deg * (Math.PI / 180);}

	return orbit;
};