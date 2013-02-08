function main () {
	program.vertex_position_attribute = gl.getAttribLocation(program, 'vertex_position_attribute');

	gl.enableVertexAttribArray(program.vertex_position_attribute);

	program.mvp_matrix_uniform = gl.getUniformLocation(program, 'mvp_matrix_uniform');

	program.drawArrayBuffer = function (buffer, mvp_matrix, mode, type) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);
		gl.vertexAttribPointer(program.vertex_position_attribute, info.item_size, type || gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(program.mvp_matrix_uniform, false, mvp_matrix);
		gl.drawArrays(mode || gl.TRIANGLES, 0, info.item_length);
	};

	program.drawArrayBufferStrip = function (buffer, mvp_matrix, type) {
		program.drawArrayBuffer(buffer, mvp_matrix, gl.TRIANGLE_STRIP, type);
	}
}
