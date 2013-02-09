"use strict";


exports.init = function (nebula, callback) {
	var stars = {},
	    engine = nebula.engine,
	    buffer = engine.buffer,
	    shader = engine.shader,
	    camera = engine.camera,
	    texture = engine.texture,
	    gl = engine.gl;


	texture.load('star-sprite.png', function (error, sprite) {
		if (error) {
			console.error(error);
			return callback(error);
		}


		stars.sprite = sprite;


		shader.load('nebula/stars', function (error, program) {
			if (error) {
				console.error(error);
				return callback(error);
			}


			stars.program = program;


			stars.generate = function (options) {
				options = options || {};

				var amount = (options.amount || 1000) * 4,
				    range = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
				    maxX = options.maxX ||  50.0,
				    minX = options.minX || -50.0,
				    maxY = options.maxY ||  50.0,
				    minY = options.minY || -50.0,
				    maxZ = options.maxZ ||  50.0,
				    minZ = options.minZ || -50.0,
				    list = new Float32Array(amount);

				for (var i = 0; i < amount; i += 4) {
					list[i]     = randomScaler(minX, maxX);
					list[i + 1] = randomScaler(minY, maxY);
					list[i + 2] = randomScaler(minZ, maxZ);
					list[i + 3] = randomScaler(range[0] * 2, range[1] / 2);
				}

				function randomScaler (min, max) {
					return Math.random() * (max - min) + min;
				}

				stars.list = buffer.createArray('stars', list, {item_size: 4});

				return stars;
			};


			stars.render = function () {
				gl.useProgram(program);

				gl.disable(gl.DEPTH_TEST);

				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

				program.draw(stars.list, sprite, camera.matrix());
			};


			callback(null, stars);
		});
	});


	return stars;
};
