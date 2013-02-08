exports.init = function (engine) {
	var manager = {};

	manager.cache = {};


	manager.load = function (name, url, options, callback) {
		// TODO: use responseType="arraybuffer" to load array buffers with XHR
	};


	manager.createArray = function (name, list, options) {
		return manager.createBuffer(name, list, options);
	};


	manager.createElements = function (name, list, options) {
		options = options || {};
		options.type = engine.gl.ELEMENT_ARRAY_BUFFER;

		return manager.createBuffer(name, list, options);
	};


	manager.createBuffer = function (name, array_buffer, options) {
		var gl = engine.gl,
		    buffer = gl.createBuffer();

		options = options || {};
		options.type = options.type || gl.ARRAY_BUFFER;
		options.length = options.length || array_buffer.length || 0;
		options.draw_type = options.draw_type || gl.STATIC_DRAW;
		options.item_size = options.item_size || 1;
		options.item_length = options.length / buffer.item_size;

		gl.bindBuffer(options.type, buffer);
		gl.bufferData(options.type, array_buffer, options.draw_type);

		buffer.info = options;

		return manager.cache[name] = buffer;
	}


	manager.get = function (name) {
		return manager.cache[name];
	};


	return manager;
};
