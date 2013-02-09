"use strict";


exports.init = function (nebula, callback) {
	var planes = {};

	planes.render = function () {};

	callback(null, planes);

	return planes;
};
