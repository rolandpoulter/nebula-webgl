function main () {
	program.vertex_position_attribute = gl.getAttribLocation(program, 'aVertexPosition');

	gl.enableVertexAttribArray(program.vertex_position_attribute);

	program.p_matrix_uniform = gl.getUniformLocation(program, 'uPMatrix');
	program.mv_matrix_uniform = gl.getUniformLocation(program, 'uMVMatrix');

	program.setMatrixUniforms = function (mv_matrix, p_matrix) {
		gl.uniformMatrix4fv(program.p_matrix_uniform, false, p_matrix);
		gl.uniformMatrix4fv(program.mv_matrix_uniform, false, mv_matrix);
	};

	program.drawTriangleStripBuffer = function (buffer, model_matrix, camera) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);
		gl.vertexAttribPointer(program.vertex_position_attribute, info.item_size, gl.FLOAT, false, 0, 0);

		program.setMatrixUniforms(camera.matrix(model_matrix), camera.projection);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, info.item_length);
	};
}
