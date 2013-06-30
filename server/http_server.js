var http = require('http'),
url = require('url'),
route = require('./http_router'),
async = require('async');

function run() {
async.series([
	function run() {
	var server_configuration = function(request, response) {
		var pathname = url.parse(request.url).pathname;
		async.series([
			response.writeHead(200, {"Content-type": "text/plain"}),
			route.route(pathname, response),
			response.end(),
			console.log("Person Connected")
		]);
	};
		http.createServer(server_configuration).listen(8888);
		console.log("Server has started");
	}
]);
}

exports.run = run;