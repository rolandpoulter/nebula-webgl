"use strict";


exports.init = function (engine, callback) {
	var square = {},
	    canvas = engine.canvas,
	    camera = engine.camera,
	    matrix = engine.math.mat4,
	    gl = engine.gl;


	square.engine = engine;

	engine.shader.load('white', function (error, white) {
		if (error) {
			console.error(error);
			if (callback) callback(error);
		}

		square.white = white;

		square.resize = window.onresize = resize;
		square.render = render;

		function resize () {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			render();
		};


		canvas.clear(
			gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
			gl.DEPTH_TEST,
			[0, 0, 0, 1.0]
		);


		var quad_matrix = matrix.create();
		var quad_buffer = engine.buffer.createArray('quad', new Float32Array([
			 1.0,  1.0,  0.0,
			-1.0,  1.0,  0.0,
			 1.0, -1.0,  0.0,
			-1.0, -1.0,  0.0
		]), {item_size: 3});


		function render () {
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
			camera.perspective(45, canvas.width / canvas.height, 0.1, 100.0);
			camera.lookAt(
				[0.0, 0.0, 0.0],
				[0.0, 0.0, 0.0],
				[0.0, 1.0, 0.0]
			);
	
			matrix.identity(quad_matrix);
			matrix.translate(quad_matrix, quad_matrix, [0.0, 0.0, -7.0]);
	
			white.drawFloatArrayBufferStrip(quad_buffer, camera.mvp_matrix(quad_matrix));
	
			return true;
		}


		resize();


		if (callback) {
			callback(null, square);
		}
	});


	return square;
};
