var browserify = require('browserify'),
    express = require('express'),
    http = require('http'),
    path = require('path');


var app = express(),
    bundle;


app.configure('production', function () {
	bundle = browserify(undefined, {mount: '/main.js'});
});


app.configure(function(){
	app.set('port', process.env.PORT || 3000);

	app.use(express.logger('dev'));
 
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.compress());

	bundle = bundle || browserify(undefined, {watch: true, mount: '/main.js'});
	bundle.addEntry(path.join(__dirname, 'client', 'index.js'));
	app.use(bundle);

	app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
	app.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
