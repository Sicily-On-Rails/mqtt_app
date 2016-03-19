/* Server web (realizzato con express) che integra il broker MQTT ed il subscriber MQTT 
ricordarsi di avviare il database mongodb con il comando 'mongod' prima di avviare server
*/
var mqtt = require('mqtt')
var express = require('express');
var app = express();
var mosca = require ('mosca')
var MongoClient = require('mongodb').MongoClient;

var lastSensorValue;	//variabile di appoggio per la visualizzazione dei valori lato frontend

// **************** MongoDB ****************
var mongodbMosca = {
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'moscaLog',
  mongo: {}
};

var mongodbsettings = {
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'sensor',
  mongo: {}
};
/*
var insertvalue = function(db, callback) {
   db.collection('sensor').insertOne(
     {
           'name': 'dario'
     },
    function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the sensor collection.");
    callback();
  });
};
*/

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
      backend: mongodbMosca,
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
	console.log("\tSensor Type: "+sensorType);
	console.log("\tSensor value: "+sensorValue);

    MongoClient.connect(mongodbsettings.url, function(err, db) {
		if(err) {
			console.log("Errore nella connessione al database: "+err.message);
		}
		else {
			var sensorCollection = db.collection('sensor');
			var document = {'value': sensorValue};	//per convenzione chiamo l'oggetto che inserisco nel database 'document'
			sensorCollection.insert(document, {w:1}, function(err, result) {
				if (err){
					console.warn("Errore nell'inserimento nel database: "+err.message);  // returns error if no matching object found
				}else{
					console.log("Inserimento nel db avvenuto con successo: "+JSON.stringify(result));
				}
				db.close();
			 });
		
		}
    });

      });

console.log('Client started...');
