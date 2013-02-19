"use strict";


exports.init = function (nebula, callback) {
	var mark = {},
	    engine = nebula.engine,
	    shader = engine.shader,
	    buffer = engine.buffer,
	    camera = engine.camera,
	    gl = engine.gl;


	shader.load('white', function (error, program) {
		if (error) {
			console.error(error);
			return callback(error);
		}


		loadObj(function (error, rawObj) {
			if (error) {
				console.error(error);
				return callback(error);
			}


			var vertices = [],
			    //coordinates = [],
			    //normals = [],
			    faces = [];

			rawObj.match(/^v(?: -?\d+\.?\d*){3}$/gm).forEach(function (rawVertex) {
				vertices = vertices.concat(rawVertex.slice(2).split(' ').map(parseFloat));
			});

			//rawObj.match(/^vt(?: -?\d+\.?\d*){2}$/gm).forEach(function (rawCoordinate) {
				//coordinates = coordinates.concat(rawCoordinate.slice(3).split(' ').map(parseFloat));
			//});

			//rawObj.match(/^vn(?: -?\d+\.?\d*){3}$/gm).forEach(function (rawNormal) {
				//normals = normals.concat(rawNormal.slice(3).split(' ').map(parseFloat));
			//});

			rawObj.match(/^f(?: \d+\/?\d*\/?\d*)+$/gm).forEach(function (rawFace) {
				faces.push(rawFace.slice(2).split(' ').map(function (refs) {
					return refs.split('/').map(function (v) {
						return parseInt(v, 10);
					});
				}));
			});

			mark.obj = {
				vertices: vertices,
				//coordinates: coordinates,
				//normals: normals,
				faces: faces
			};
			console.log(mark.obj);


			mark.render = function () {
				gl.useProgram(program);

				var vertices = mark.obj.vertices;
				var index = 0;
				//mark.obj.faces.slice(index, index + 5).forEach(function (face) {
				mark.obj.faces.forEach(function (face) {
					var temp_face = new Float32Array(face.length * 3);

					//debugger;
					face.forEach(function (refs, i) {
						//console.log(refs[0]);
						//debugger;
						var v = refs[0] * 3;
						i *= 3;
						temp_face[i + 0] = vertices[v - 3]// * 0.01;
						temp_face[i + 1] = vertices[v - 2]// * 0.01;
						temp_face[i + 2] = vertices[v - 1]// * 0.01;
						//console.log(temp_face);
					});

					var face_buffer = buffer.createArray('', temp_face, {item_size: 3});

					program.drawFloatArrayBuffer(face_buffer, camera.mvpMatrix(), engine.gl.LINE_LOOP);
				});
				//program.drawFloatArrayBuffer(
					//buffer.createArray('', new Float32Array(mark.obj.vertices), {item_size: 3}),
					//camera.mvpMatrix(),
					//engine.gl.POINTS
				//);
			};


			callback(null, mark);
		});


		function loadObj (callback) {
			var request = new XMLHttpRequest();

			request.onload = function () {
				var status = request.status;

				if (status >= 200 && status < 300 || status === 304) {
					callback(null, request.responseText);

				} else {
					callback('Error requesting nebula mark object.', null, request);
				}
			};

			request.open('get', '/assets/nebula-mark-triangulated.obj', true);
			request.send();
		}
	});


	return mark;
};
