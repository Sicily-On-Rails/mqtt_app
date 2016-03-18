/* Server web (realizzato con express) che integra il broker MQTT ed il subscriber MQTT */
var mqtt = require('mqtt')
var express = require('express');
var app = express();
var mosca = require ('mosca')

var lastSensorValue;	//variabile di appoggio per la visualizzazione dei valori lato frontend


// **************** Metodi richiamabili dal browser ****************

app.get('/', function (req, res) {
  res.send('Hello World!');
});

http://localhost:3000/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//http://localhost:3000/test
app.get('/test', function (req, res) {
  res.send('Hello World from test!');
});

//metodo per avere l'ultimo valore ricevuto richiamabile da browser: http://localhost:3000/getLastValue
//TODO: implementare la lettura di un array con gli ultimi N valori o lettura da un database
app.get('/getLastValue', function (req, res) {
  res.send(lastSensorValue);
});

// **************** Fine metodi richiamabili dal browser ****************




// **************** MOSCA CONFIGURATION - INIZIO CODICE BROKER MQTT ****************

	var settings = {
	  port: 1883,
	  persistence: mosca.persistence.Memory
	};

	var server = new mosca.Server(settings, function() {
	  console.log('Mosca Server is up and running')
	});


	server.on('clientConnected', function(client) {
		console.log('client connected', client.id);
	});

	// fired when a message is received
	server.on('published', function(packet, client) {
	  console.log('Published', packet.payload);
	});

	server.on('ready', setup);

	// fired when the mqtt server is ready
	function setup() {
	  console.log('Mosca server is up and running');
}
// **************** MOSCA CONFIGURATION - FINE CODICE BROKER MQTT ****************



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
		lastSensorValue=sensorValue;		//memorizzo per test in una variabile il valore da tornare con il metodo GET '/getLastValue'
		console.log("Sensor Type: "+sensorType);
		console.log("Sensor value: "+sensorValue);
      });
	  
console.log('Client started...');
