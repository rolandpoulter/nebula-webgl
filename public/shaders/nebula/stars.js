function main () {
	var vertex_position_attribute = gl.getAttribLocation(program, 'vertex_position_attribute'),
	    point_size =                gl.getAttribLocation(program, 'point_size');

	gl.enableVertexAttribArray(vertex_position_attribute);
	gl.enableVertexAttribArray(point_size);

	var mvp_matrix_uniform = gl.getUniformLocation(program, 'mvp_matrix_uniform'),
	    texture_uniform    = gl.getUniformLocation(program, 'texture');

	program.draw = function (buffer, texture, mvp_matrix) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);

		gl.vertexAttribPointer(vertex_position_attribute, 3, gl.FLOAT, false, 16, 0);
		gl.vertexAttribPointer(point_size,                1, gl.FLOAT, false, 16, 12);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(texture_uniform, 0);

		gl.uniformMatrix4fv(mvp_matrix_uniform, false, mvp_matrix);

		gl.drawArrays(gl.POINTS, 0, info.item_length);
	};
}
