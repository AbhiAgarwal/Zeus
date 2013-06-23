// Importing the modules for the application
var nodeThinkGear = require('node-thinkgear'),
say = require('say'),
jquery = require("jquery"),
translate = require('translate'),
sys = require('sys'),
colors = require('colors'),
putt = require('putt'),
twitter = require('ntwitter'),
twilio = require('twilio'),
growl = require('growl'),
http = require('http'),
server = require('./server/http_server'),
time = require('time')(Date),
fs = require('fs-extra');

// Creating & Declearing the person using this
var person = {
	// Personal Details
	full_name: "Abhi Agarwal", // Full Name
	first_name: "Abhi", // First Name
	last_name: "Agarwal", // Last Name
	// City Details
	city: "Bangkok", // City you live in
	country: "Thailand", // Country you live in
	latitude: 13.45, // LAT of your city
	longitude: 100.30, // LANG of your city
	// Speaker Details
	speaker: "Daniel", // check to see if this is already installed on your Computer (OSX)
	language: "English", // Language the person is in
	computer: "Abhi", // The name of the computer you're currently on
	// Twitter Person Configuration
	twitter_access_token: "",
	twitter_access_token_secret: "",
	twitter_name: "",
	facebook_ID: "",
	facebook_IDName: ""
};

// Loading functions and main settings at the beginning,
// before launching the web application
function run() {
	// weather files need to be configured so they are ready to be said to the user at the start
	get_weather();
	// this is the server file running the web client that will interact with the Java protocol
	server.run();
}

// Support Functions
// Converts fahrenheit to celsius, not required if
// you live in the US
function convert_fahrenheitTocelsius(temperature) {
	return String(((temperature - 32) * (5/9))).substring(0, 3);
	console.log("Converted");
}

// Timing Functions to test the speeds of different functions
// These are just outlines, don't have to be used
var Timer = function(){};

Timer.prototype.start = function(){
	return (new Date().getTime());
	console.log("Timer started");
};

Timer.prototype.end = function(){
	return (new Date().getTime());
	console.log("Timer ended");
};

Timer.prototype.total = function(){
	this.total_time = this.end_time - this.start_time;
	console.log("Total time is: " + total_time)
	return(this.total_time);
};

// API Keys for different applications
var apiKeys = {
	// Forecast.IO Authentication Key
	forecastIO: '',
	// Mindwave (own API key - not from mindwave server) API Key
	mindwave: '',
	// Twitter Authentication Keys
	twitter_consumer_key: "",
	twitter_consumer_secret: "",
	twilio_SID: "",
	twilio_AUTH: "",
	// Facebook Authentication Keys
	facebook_appID: "",
	facebook_appSecret: "",
	facebook_accessToken: "",
	// Email Authentication Keys
	email_user: "",
	email_pass: "",
	email_host: "smtp.gmail.com",
	email_port: 465,
	email_ssl: true
};

// Twitter Setup
var twit = new twitter({
  consumer_key: apiKeys.twitter_consumer_key,
  consumer_secret: apiKeys.twitter_consumer_secret,
  access_token_key: person.twitter_access_token,
  access_token_secret: person.twitter_access_token_secret
});

// Twilio Setup
var client = new twilio.RestClient(
	apiKeys.twilio_SID, 
	apiKeys.twilio_AUTH
);

// DateTime configuration

var date_general = new Date();
date_general.setTimezone('UTC');
var datetime = date_general.toString().substring(0, 15);

// Startup of the different speakings
var say_fullStartup = function() {
	say.speak(person.speaker, "Goodmorning Mr. " + person.last_name 
		+ ". What can I do for you today?");
};

var say_generalStartup = function() {
	say.speak(person.speaker, "Goodmorning Mr. " + person.last_name + ".");
};

// Weather configuration
// Weather Setting
var weather = {
	time: "",
	summary: "",
	temperature: "",
	file: false
};

// Gets Weather from the ForecastIO API and saves the JSON file
var set_weather = function() {
	jquery.getJSON('https://api.forecast.io/forecast/'+ apiKeys.forecastIO + '/' + person.latitude + ',' + person.longitude, function(data) {
		fs.writeJson('./files/weather' + datetime + '.json', data, function(err){
			if(err){
				console.log(err);
			}
		});
	});
};

// Geather from the JSON file
var get_weather = function() {
	fs.readJson('./files/weather' + datetime + '.json', function(err, data) {
		if(err){
			set_weather();
		}
		weather.time = datetime;
		weather.summary = data.currently.summary;
		weather.temperature = String(convert_fahrenheitTocelsius(String(data.currently.temperature)));
		weather.file = true;
	});
};

// Applications Function
// Gets weather from Forecast.IO API, or JSON file and says it
var say_getWeather = function() {
	if(weather.summary == ""){
		get_weather();
	}
	else {
		say.speak(person.speaker, "In Bangkok there is a chance of "
			+ String(weather.summary)
			+ " , with a temperature of "
			+ String(weather.temperature)
			+ "Celcius"
		);
	}
};

// Sends an email to inputted email via the zeusdwarika email account
var send_email = function(email_to, subject_line, body_line){
	putt({
	    user: apiKeys.email_user,
	    pass: apiKeys.email_pass,
	    host: apiKeys.email_host,
	    port: apiKeys.email_port,
	    ssl: apiKeys.email_ssl
	}).email(body_line, {to: email_to, subject: subject_line});
	console.log("The Email has been sent");
};

// Uses the neurosky mindwave technology in the application
var mindwave_connect = function() {
	var tgClient = nodeThinkGear.createClient({
		appName: person.full_name,
		appKey: apiKeys.mindwave
	});
	tgClient.on('data', function(data){
		say.speak(person.speaker, data.eSense.attention), function () {
			console.log(data);
		}
	});
	tgClient.connect();
	console.log("Connection with the mindwave has been established");
};

// Tweets the text inputted
var twitter_SendTweet = function(tweet_message) {
	twit.verifyCredentials(function (err, data) {
		// Gets data here
	  }).updateStatus(tweet_message,
	    function (err, data) {
	    	// Logs if it has a problem
	      console.log(data);
	    }
	  );
	console.log(tweet_message + " - Tweet sent!");
};

// Get Tweets from your account depending on Tweet Number
var twitter_GetTweet = function(tweet_number) {
	twit.verifyCredentials(function (err, data) {
		// Gets data here
	  }).getUserTimeline(
	    function (err, data) {
	    	// Logs if it has a problem
	      console.log(data[tweet_number].text);
	    }
	  );
	console.log("Getting " + person.twitter_name + "'s " + tweet_number + " Tweet!");
};

// Gets English Tweets from around the World
var twitter_WhatsHappeningInTheWorld = function(){
	twit.stream('statuses/sample', function(stream) {
  		stream.on('data', function (data) {
  			if(data.lang == 'en')
    			console.log(data.text);
 		});
	});
};

// Sending SMS via Twilio
var twilio_SendSMS = function(message_number, message_body) {
	client.sms.messages.create({
		to: message_number,
		from: '+14423337001',
		body: message_body
		}, function(error, message) {
			if (!error) {
				console.log('SMS Sent!');
			}
			else {
				console.log('SMS not Sent!');
			}
	});
};

// Sending notifications via Growl to Mac OSX
var send_Notification = function() {
	growl('Show pdf filesystem icon', { image: 'article.pdf' }, function(){
  		console.log('Notification has been sent');
	})
};

// Personal Detail Functions
// If not already use the function to find the Lat/Lang
// Finding the latitude & longitude of the person
var get_LatitudeLongitude = function(city, country) {
	jquery.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + city + '+' + country + '&sensor=true', function(data) {
		console.log("%o", data);
	});
	console.log("Location determined");
};

// Test Functions
// This is an outline of the Timer function
var functionTime = function(){

	var timers = new Timer();
	var start = timers.start();

		for (i = 0; i < 100; ++i) {
			// doesn't matter what goes here
		}

	var end = timers.end();
	console.log(end - start);
};

// Starts executing the server
run();

// Exports the functions to the HTTP Handlers
exports.say_fullStartup = say_fullStartup;
exports.say_generalStartup = say_generalStartup;
exports.say_getWeather = say_getWeather;
exports.weather = weather;