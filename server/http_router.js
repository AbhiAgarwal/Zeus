var requestHandler = require('./http_handler'),
handle = {};

handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/weather"] = requestHandler.weather;
handle["/yessir"] = requestHandler.say_yessir;

function route(pathname, response) {
	console.log("About to route a request for " + pathname);
	if(typeof handle[pathname] === 'function') {
		handle[pathname](response);
	}
	else {
		console.log("No request handler found for " + pathname);
	    requestHandler.not_found(response);
	}
}

exports.route = route;