var zeus = require('../zeus');

function start(response) {
	console.log("HTTP Command - Starting up Zeus");
	zeus.say_fullStartup();
	response.write("Zeus Starting up, Mr. " + zeus.personal_details.last_name);
}

function start_command(response) {
	console.log("HTTP Command - Starting up Zeus w/ Command");
	response.write("Zeus Starting up & Executing command");
}

function say_yessir(response) {
	console.log("HTTP Command - Yes Sir?");
	zeus.say_yessir();
	response.write("Yes Sir?");
}

function not_found(response) {
	response.write("404 Not found");
}

function weather(response) {
	console.log("HTTP Command - Zeus Weather");
	var data = zeus.say_getWeather();
	response.write(zeus.weather.summary);
}

exports.start = start;
exports.start_command = start_command;
exports.not_found = not_found;
exports.weather = weather;
exports.say_yessir = say_yessir;