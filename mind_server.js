var nodeThinkGear = require('node-thinkgear'),
say = require('say'),
translate = require('translate'),
sys = require('sys'),
colors = require('colors'),
appjs = require('appjs');

var tgClient = nodeThinkGear.createClient({
	appName:'AbhiAgarwal',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
});

tgClient.on('data', function(data){
	say.speak('Alex', data.eSense.attention), function () {
	console.log(data);
}
});

tgClient.connect();
console.log("Connection has been established");