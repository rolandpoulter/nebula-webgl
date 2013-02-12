"use strict";


exports.init = function (nebula, callback) {
	var stars = {},
	    engine = nebula.engine,
	    buffer = engine.buffer,
	    shader = engine.shader,
	    camera = engine.camera,
	    texture = engine.texture,
	    gl = engine.gl;


	texture.load('nebula/star-sprite.png', function (error, sprite) {
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

				var size = 9,
				    amount = (options.amount || 2337) * size,
				    range = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
				    minS = range[0],
				    maxS = range[1] < 24 ? range[1] : 24,
				    maxX = options.maxX ||  500.0,
				    minX = options.minX || -500.0,
				    maxY = options.maxY ||  500.0,
				    minY = options.minY || -500.0,
				    maxZ = options.maxZ ||  500.0,
				    minZ = options.minZ || -500.0,
				    list = new Float32Array(amount),
				    i = 0;

				while (i < amount) {
					list[i++] = random(minX, maxX);
					list[i++] = random(minY, maxY);
					list[i++] = random(minZ, maxZ);
					list[i++] = random(minS, maxS);
					list[i++] = 1.94 - (0.16 * Math.random());
					list[i++] = 1.94 - (0.16 * Math.random());
					list[i++] = 1.91 - (0.11 * Math.random());Math.random();
					list[i++] = Math.random();
				}

				function random (min, max) {
					return Math.random() * (max - min) + min;
				}

				stars.list = buffer.createArray('nebula/stars', list, {item_size: size});

				return stars;
			};


			stars.render = function () {
				gl.useProgram(program);

				gl.disable(gl.DEPTH_TEST);

				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

				gl.blendEquation(gl.FUNC_ADD);

				program.draw(stars.list, sprite, camera.mvpMatrix());

				return stars;
			};


			callback(null, stars);
		});
	});


	return stars;
};
