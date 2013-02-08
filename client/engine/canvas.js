"use strict";


exports.init = function (parent) {
	var canvas = document.createElement('canvas');

	try {
		canvas.gl = canvas.getContext('experimental-webgl');
	} catch (e) {}

	if (parent) {
		if (!canvas.gl) {
			parent.innerHTML = 'Could not initialise WebGL.';

		} else {
			parent.appendChild(canvas);
		}
	}

	canvas.clear = function (flags, enable, color) {
		var gl = canvas.gl;

		if (enable) gl.enable(enable);
		if (color) gl.clearColor.apply(gl, color);

		gl.clear(flags);

		return canvas;
	};

	return canvas;
};
