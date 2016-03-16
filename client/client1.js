/*mqtt*/

var mqtt = require('mqtt')

/*connect to the server*/
client = mqtt.createClient(1883, 'localhost');

/*subscribe to a topic named 'presence'*/
client.subscribe('presence');

console.log('Client publishing..');
/*we publish a message to 'presence'*/
client.publish('presence','Client 1 is alive.. Test Ping!' + Date());

client.end();
