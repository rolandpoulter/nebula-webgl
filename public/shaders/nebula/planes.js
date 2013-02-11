function main () {
	var vertex_position_attribute =   gl.getAttribLocation(program, 'vertex_position_attribute'),
	    vertex_coordinate_attribute = gl.getAttribLocation(program, 'vertex_coordinate_attribute');

	var mvp_matrix_uniform = gl.getUniformLocation(program, 'mvp_matrix_uniform'),
	    opacity_uniform =    gl.getUniformLocation(program, 'opacity_uniform'),
	    texture_uniform =    gl.getUniformLocation(program, 'texture_uniform');

	program.draw = function (buffer, texture, model_matrix_list, camera) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);

		gl.enableVertexAttribArray(vertex_position_attribute);
		gl.enableVertexAttribArray(vertex_coordinate_attribute);

		gl.vertexAttribPointer(vertex_position_attribute,   3, gl.FLOAT, false, 20, 0);
		gl.vertexAttribPointer(vertex_coordinate_attribute, 2, gl.FLOAT, false, 20, 12);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(texture_uniform, 0);

		var vec3 = engine.math.vec3;

		model_matrix_list.forEach(function (model_matrix) {
			var plane_vector = vec3.transformMat4([], [0, 0, 0], model_matrix),
			    camera_vector = vec3.normalize([], vec3.sub([], vec3.add([], camera.position, camera.target), plane_vector)),
			    normal_vector = vec3.normalize([], vec3.transformMat4([], [0, 0, 1], model_matrix.rotation)),
			    opacity = Math.abs(vec3.dot(camera_vector, normal_vector)) * 0.75;

			gl.uniformMatrix4fv(mvp_matrix_uniform, false, camera.mvp_matrix(model_matrix));
			gl.uniform1f(opacity_uniform, opacity);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, info.item_length);
		});

		gl.disableVertexAttribArray(vertex_position_attribute);
		gl.disableVertexAttribArray(vertex_coordinate_attribute);
	};
}
