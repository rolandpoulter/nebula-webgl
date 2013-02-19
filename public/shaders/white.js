function main () {
	var vertex_position_attribute = gl.getAttribLocation(program, 'vertex_position_attribute');

	console.log(program);
	var mvp_matrix_uniform = gl.getUniformLocation(program, 'mvp_matrix_uniform');

	program.drawFloatArrayBuffer = function (buffer, mvp_matrix, mode) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);

		gl.enableVertexAttribArray(vertex_position_attribute);
		gl.vertexAttribPointer(vertex_position_attribute, info.item_size, gl.FLOAT, false, 0, 0);

		console.log(program);
		gl.uniformMatrix4fv(mvp_matrix_uniform, false, mvp_matrix);

		gl.drawArrays(isFinite(mode) ? mode : gl.TRIANGLES, 0, info.item_length);

		gl.disableVertexAttribArray(vertex_position_attribute);
	};

	program.drawFloatArrayBufferStrip = function (buffer, mvp_matrix) {
		program.drawFloatArrayBuffer(buffer, mvp_matrix, gl.TRIANGLE_STRIP);
	};
}
