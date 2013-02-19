"use strict";


exports.init = function (engine) {
	var events = {},
	    camera = engine.camera;


	var action = events.action = {
		up: function (amount, shift) {
			if (shift) {
				action.forward(amount);
			
			} else {
				camera.position[1] += amount || 0.25;
				console.log(camera.position);
			}
		},

		down: function (amount, shift) {
			if (shift) {
				action.backward(amount);

			} else {
				camera.position[1] -= amount || 0.25;
				console.log(camera.position);
			}
		},

		left: function (amount) {
			camera.position[0] -= amount || 0.25;
			console.log(camera.position);
		},

		right: function (amount) {
			camera.position[0] += amount || 0.25;
			console.log(camera.position);
		},

		forward: function (amount) {
			camera.position[2] -= amount || 0.25;
			console.log(camera.position);
		},

		backward: function (amount) {
			camera.position[2] += amount || 0.25;
			console.log(camera.position);
		}
	};


	window.onkeydown = function (e) {
		var name = e.keyIdentifier.toLowerCase();

		if (action[name]) {
			action[name](null, e.shiftKey);
		}
	};


	window.onmousedown = function (e) {
		var startX = e.pageX,
		    startY = e.pageY;

		window.onmouseup = function () {
			window.onmousemove = null;
		};

		window.onmousemove = function (e) {
			var diffX = e.pageX - startX,
			    diffY = e.pageY - startY,
			    threshold = 50,
			    amount = 0.1;

			if (diffX > threshold) {
				action.right(amount);

			} else if (diffX < threshold) {
				action.left(amount);
			}

			if (diffY > threshold) {
				action.up(amount, e.shiftKey);

			} else if (diffY < threshold) {
				action.down(amount, e.shiftKey);
			}
		};
	};


	var canvas = engine.canvas;


	var touch = {
		count: 0
	};

	canvas.ontouchstart = function (e) {
		touch.count += 1;
		touch.startX = touch.startX || e.pageX;
		touch.startY = touch.startY || e.pageY;

		e.stopPropagation();
		e.preventDefault();
	};

	canvas.ontouchmove = function (e) {
		var diffX = e.pageX - touch.startX,
		    diffY = e.pageY - touch.startY,
		    threshold = 10,
		    amount = 0.1;

		if (diffX > threshold) {
			action.right(amount);

		} else if (diffX < threshold) {
			action.left(amount);
		}

		if (diffY > threshold) {
			action.up(amount, touch.count > 1);

		} else if (diffY < threshold) {
			action.down(amount, touch.count > 1);
		}

		e.stopPropagation();
		e.preventDefault();
	};

	canvas.ontouchcancel = function (e) {
		touch.count -= 1;

		if (touch.count <= 0) {
			touch.count = 0;
			touch.startX = 0;
			touch.startY = 0;
		}

		e.stopPropagation();
		e.preventDefault();
	};

	canvas.ontouchend =
	canvas.ontouchleave = function (e) {
		window.ontouchmove(e);
		window.ontouchcancel(e);

		e.stopPropagation();
		e.preventDefault();
	};


	return events;
};
