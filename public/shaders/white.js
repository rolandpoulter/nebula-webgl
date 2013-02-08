function main () {
	program.vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition');

	gl.enableVertexAttribArray(program.vertexPositionAttribute);

	program.mvpMatrixUniform = gl.getUniformLocation(program, 'uMVPMatrix');

	program.setMatrixUniforms = function (mvp_matrix) {
		gl.uniformMatrix4fv(program.mvpMatrixUniform, false, mvp_matrix);
	};

	program.drawTriangleBuffer = function (buffer, model_matrix, camera) {
		var info = buffer.info;

		gl.bindBuffer(info.type, buffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, info.item_size, gl.FLOAT, false, 0, 0);

		program.setMatrixUniforms(camera.matrix(model_matrix));

		gl.drawArrays(gl.TRIANGLES, 0, info.items_length);
	};
}
