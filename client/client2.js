/*mqtt*/
var mqtt = require('mqtt')

/*connect to the server*/
client = mqtt.createClient(1883, 'localhost');

/*subscribe to a topic named 'MIO_TOPIC'*/
client.on('connect', function() { // When connected
	client.subscribe('MIO_TOPIC');

});

client.on("message", function(topic, payload,packet) {
        console.log("PACCHETTO RICEVUTO: "+packet.payload.toString());
		
		//faccio il parse JSON del messaggio ricevuto
		var json = JSON.parse(packet.payload);
		var sensorType= json.type;
		var sensorValue= json.value;		//valore da memorizzare in un array o database per la successiva visualizzazione su un grafico lato client web
		console.log("Sensor Type: "+sensorType);
		console.log("Sensor value: "+sensorValue);
      });
	  
console.log('Client started...');
