"use strict";


exports.init = function (nebula, callback) {
	var planes = {},
	    engine = nebula.engine,
	    shader = engine.shader,
	    buffer = engine.buffer,
	    camera = engine.camera,
	    matrix = engine.math.mat4,
	    gl = engine.gl;


	shader.load('nebula/planes', function (error, program) {
		if (error) {
			console.error(error);
			return callback(error);
		}


		planes.program = program;


		planes.square = buffer.createArray('nebula/planes/square', new Float32Array([
			 1.0,  1.0,  0.0,
			-1.0,  1.0,  0.0,
			 1.0, -1.0,  0.0,
			-1.0, -1.0,  0.0
		]), {item_size: 3});


		planes.generate = function (options) {
			options = options || {};

			var amount = options.amount || 24,
			    maxS = options.maxS ||  5,
			    minS = options.minS ||  1,
			    maxR = options.maxR ||  5,
			    minR = options.minR || -5,
			    maxT = options.maxT ||  1,
			    minT = options.minT || -1,
			    list = [],
			    s;

			for (var i = 0; i < amount; i += 1) {
				list[i] = matrix.create();
				s = random(minS, maxS);
				matrix.scale(list[i], list[i], [s, s, s]);
				matrix.rotate(list[i], list[i], random(minR, maxR), [
					random(),
					random(),
					random()
				]);
				matrix.translate(list[i], list[i], [
					random(minT, maxT),
					random(minT, maxT),
					random(minT, maxT)
				]);
			}
	
			function random (min, max) {
				min = min || -1;
				max = max ||  1;
				return Math.random() * (max - min) + min;
			}

			planes.model_matrix_list = list;

			return planes;
		};


		planes.render = function () {
			gl.useProgram(program);

			//gl.disable(gl.DEPTH_TEST);
			gl.enable(gl.DEPTH_TEST);

			//gl.enable(gl.BLEND);
			//gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

			program.draw(planes.square, planes.model_matrix_list, camera);

			return planes;
		};


		callback(null, planes);
	});


	return planes;
};
