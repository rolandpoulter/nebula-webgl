"use strict";


exports.init = function (engine) {
	var manager = {};

	manager.image_dir = '/img';

	manager.cache = {};


	manager.load = function (name, callback) {
		if (manager.cache.hasOwnProperty(name)) {
			callback(null, manager.get(name));
		}

		var image = new Image();

		image.onload = function () {
			callback(null, manager.prepare(name, image));
		};

		image.src = manager.image_dir + '/' + name;

		return manager;
	};


	manager.prepare = function (name, image) {
		var gl = engine.gl,
		    texture = gl.createTexture();

		texture.image = image;

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);

		if (!name) return texture;

		return manager.cache[name] = texture;
	};


	manager.get = function (name) {
		return manager.cache[name];
	};


	return manager;
};
