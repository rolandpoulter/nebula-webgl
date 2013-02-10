function main () {
	var vertex_position_attribute = gl.getAttribLocation(program, 'vertex_position_attribute');

	var mvp_matrix_uniform = gl.getUniformLocation(program, 'mvp_matrix_uniform');

	program.draw = function (buffer, model_matrix_list, camera) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);

		gl.enableVertexAttribArray(vertex_position_attribute);
		gl.vertexAttribPointer(vertex_position_attribute, info.item_size, gl.FLOAT, false, 0, 0);

		model_matrix_list.forEach(function (model_matrix) {
			gl.uniformMatrix4fv(mvp_matrix_uniform, false, camera.matrix(model_matrix));

			gl.drawArrays(gl.LINE_STRIP, 0, info.item_length);
		})

		gl.disableVertexAttribArray(vertex_position_attribute);
	};
}
