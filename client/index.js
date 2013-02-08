var engine = require('./engine').init(document.body),
    canvas = engine.canvas,
    camera = engine.camera,
    matrix = engine.math.mat4,
    quad = require('./nebula/quad'),
    gl = engine.gl;


window.engine = engine;


engine.shader.load('white', function (error, white) {
	if (error) {
		return console.error(error);
	}


	window.onresize = resize;

	resize();

	function resize () {
		canvas.width = this.innerWidth;
		canvas.height = this.innerHeight;
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
		camera.lookAt([0.0, 0.0, 7.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

		matrix.identity(quad_matrix);
		//matrix.translate(model_matrix, [0.0, 0.0, -7.0]);

		white.drawTriangleBuffer(quad_buffer, quad_matrix, camera);

		return true;
	}

	render();
});
