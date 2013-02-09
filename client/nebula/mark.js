"use strict";


exports.init = function (nebula, callback) {
	var mark = {};

	mark.render = function () {};

	callback(null, mark);

	return mark;
};
