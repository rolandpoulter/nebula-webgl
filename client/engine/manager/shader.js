exports.init = function (engine) {
	var manager = {};

	manager.shader_dir = '/shaders';

	manager.procedure_ext = 'js';
	manager.fragment_ext = 'fragment';
	manager.vertex_ext = 'vertex';

	manager.cache = {};


	manager.load = function (name, callback) {
		if (manager.cache.hasOwnProperty(name)) {
			callback(null, manager.get(name));
		}

		var procedure_request = new XMLHttpRequest(),
		    fragment_request = new XMLHttpRequest(),
		    vertex_request = new XMLHttpRequest();

		var url = manager.shader_dir + '/' + name;

		procedure_request.onload =
		fragment_request.onload =
		vertex_request.onload = finish;

		send(procedure_request, manager.procedure_ext);
		send(fragment_request, manager.fragment_ext);
		send(vertex_request, manager.vertex_ext);

		function send (request, ext) {
			request.open('get', url + '.' + ext, true);
			request.send();
		}

		function isSuccess (request) {
			var status = request.status;
			return status >= 200 && status < 300 || status === 304 
		}

		finish.count = 0;
		finish.target = 3;

		function finish () {
			finish.count += 1;

			if (finish.count === finish.target) {
				if (
					isSuccess(procedure_request) &&
					isSuccess(fragment_request) &&
					isSuccess(vertex_request)
				) {
					callback(null, manager.compile(name,
						procedure_request.response,
						fragment_request.response,
						vertex_request.response
					));

				} else {
					callback({
						message: 'Failed to load shader.',

						procedure_request: procedure_request,
						fragment_request: fragment_request,
						vertex_request: vertex_request
					});
				}
			}
		}

		return manager;
	};


	manager.compile = function (name, procedure_source, fragment_source, vertex_source) {
		var gl = engine.gl;

		return manager.cache[name] = compileProgram();

		function compileProgram () {
			var program = gl.createProgram();

			gl.attachShader(program, compileVertexShader());
			gl.attachShader(program, compileFragmentShader());

			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.error('Could not link shader program: ' + name);
				return null;
			}

			return compileProcedure(program);
		}

		function compileProcedure (program) {
			try {
				eval('main();\n' + procedure_source);

			} catch (error) {
				console.error(error);
				return null;
			}

			return program;
		}

		function compileFragmentShader () {
			return compileShader(gl.FRAGMENT_SHADER, fragment_source);
		}

		function compileVertexShader () {
			return compileShader(gl.VERTEX_SHADER, vertex_source);
		}

		function compileShader (type, source) {
			var shader = gl.createShader(type);

			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error(gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;
		}
	};


	manager.use = function (name) {
		engine.gl.useProgram(manager.get(name));

		return manager;
	};


	manager.get = function (name) {
		return manager.cache[name];
	};


	return manager;
};
