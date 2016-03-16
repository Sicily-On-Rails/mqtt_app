/*mqtt*/
var mqtt = require('mqtt')

/*connect to the server*/
client = mqtt.createClient(1883, 'localhost');

/*subscribe to a topic named 'presence'*/
client.subscribe('presence');

client.on('message', function(topic, message) {
console.log(message);
});
console.log('Client started...');
