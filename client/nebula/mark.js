"use strict";


exports.init = function (nebula, callback) {
	var mark = {};

	mark.prepare = function () {};

	mark.render = function () {};

	callback(null, mark);

	return mark;
};
