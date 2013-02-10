"use strict";


exports.init = function (nebula, callback) {
	var planes = {},
	    engine = nebula.engine,
	    shader = engine.shader,
	    buffer = engine.buffer,
	    camera = engine.camera,
	    matrix = engine.math.mat4,
	    texture = engine.texture,
	    gl = engine.gl;


	texture.load('nebula/plane-cloud.png', function (error, cloud) {
		if (error) {
			console.error(error);
			return callback(error);
		}


		planes.cloud = cloud;


		shader.load('nebula/planes', function (error, program) {
			if (error) {
				console.error(error);
				return callback(error);
			}


			planes.program = program;


			planes.square = buffer.createArray('nebula/planes/square', new Float32Array([
				 1.0,  1.0,  0.0,  0.0, 0.0,
				-1.0,  1.0,  0.0,  0.0, 1.0,
				 1.0, -1.0,  0.0,  1.0, 0.0,
				-1.0, -1.0,  0.0,  1.0, 1.0
			]), {item_size: 5});


			planes.generate = function (options) {
				options = options || {};

				var amount = options.amount || 24,
				    maxS = options.maxS ||  6,
				    minS = options.minS ||  12,
				    maxR = options.maxR ||  6.2,
				    minR = options.minR ||  0,
				    maxT = options.maxT ||  0.5,
				    minT = options.minT || -0.5,
				    list = [],
				    s;

				for (var i = 0; i < amount; i += 1) {
					list[i] = matrix.create();
					matrix.rotate(list[i], list[i], random(minR, maxR), [
						Math.random(),
						Math.random(),
						Math.random()
					]);
					list[i].rotation = matrix.copy(new Float32Array(16), list[i]);
					matrix.scale(list[i], list[i], [random(minS, maxS), random(minS, maxS), random(minS, maxS)]);
					matrix.translate(list[i], list[i], [
						random(minT, maxT),
						random(minT, maxT),
						random(minT, maxT)
					]);
					continue;
				}

				function random (min, max) {
					return Math.random() * (max - min) + min;
				}

				planes.model_matrix_list = list;

				return planes;
			};


			planes.render = function () {
				gl.useProgram(program);

				gl.disable(gl.DEPTH_TEST);

				gl.enable(gl.BLEND);

				gl.blendFuncSeparate(
					gl.SRC_ALPHA,
					gl.DST_ALPHA,
					gl.SRC_COLOR,
					gl.DST_COLOR
				);

				gl.blendEquationSeparate(
					gl.FUNC_ADD,
					gl.FUNC_ADD
				);

				program.draw(
					planes.square,
					planes.cloud,
					planes.model_matrix_list,
					nebula
				);

				return planes;
			};


			callback(null, planes);
		});
	});


	return planes;
};
