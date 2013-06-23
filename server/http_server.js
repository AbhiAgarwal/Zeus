var http = require('http'),
url = require('url'),
route = require('./http_router');

function run() {
	var server_configuration = function(request, response) {

		response.writeHead(200, {"Content-type": "text/plain"});
		
		var pathname = url.parse(request.url).pathname;
		route.route(pathname, response);

		response.end();
	};
		http.createServer(server_configuration).listen(8888);
		console.log("Server has started");
}

exports.run = run;