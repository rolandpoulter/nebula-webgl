"use strict";


exports.init = function (nebula, callback) {
	var stars = {},
	    engine = nebula.engine,
	    shader = engine.shader;


	shader.load('nebula/stars', function (error, stars_shader) {
		if (error) {
			console.error(error);
			return callback(error);
		}


		stars.shader = stars_shader;


		callback(null, stars);
	});


	return stars;
};
