"use strict";


exports.init = function (parent) {
	var canvas = document.createElement('canvas'),
	    names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];

	names.forEach(function (name) {
		if (canvas.gl) return;

		try {
			canvas.gl = canvas.getContext(name);
		} catch (e) {}
	})

	if (parent) {
		if (!canvas.gl) {
			document.body.className += ' webgl-not-supported';

		} else {
			document.body.className += ' webgl-supported';

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
