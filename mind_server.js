var nodeThinkGear = require('node-thinkgear'),
say = require('say'),
translate = require('translate'),
sys = require('sys'),
appjs = require('appjs');

var tgClient = nodeThinkGear.createClient({
	appName:'',
	appKey:''
});

tgClient.on('data', function(data){
	say.speak('Alex', data.eSense.attention), function () {
	console.log(data);
}
});

tgClient.connect();
console.log("Connection has been established");
