/* Server web (realizzato con express) che integra il broker MQTT ed il subscriber MQTT
ricordarsi di avviare il database mongodb con il comando 'mongod' prima di avviare server

andare su http://localhost:3000/grafico per vedere il grafico.
*/
var mqtt = require('mqtt')
var express = require('express');
var app = express();
var mosca = require ('mosca')
var MongoClient = require('mongodb').MongoClient;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


//var lastSensorValue;	//variabile di appoggio per la visualizzazione dei valori lato frontend


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


// **************** Metodi richiamabili dal browser ****************

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
/* FUNZIONE PIU' PULITA CHE MI RITORNA SOLO VALUE SENZA _ID*/
app.get("/scores", function(req, res){
  MongoClient.connect(mongodbsettings.url, function(err, db) {
  if(err)
    {
      console.log("Errore connessione al database: "+err.message);
    }
  else
    {
      //FINALMENTE!! CONNESSO
      console.log('Connessione stabilita to', mongodbsettings.url);
      var collection = db.collection('sensor');
      //Query Mongodb and iterate through the results
      collection.find({}).toArray(
        function(err, docs){
          var result = [];
          for(index in docs){
            var doc = docs[index];
            var resultObject = {};
            resultObject.label = doc.type;
            resultObject.value = doc.value;
            result.push(resultObject);
          }
          res.json(result);
        }
      );
    }
  });
});

app.get('/grafico', function (req, res){
	 res.sendFile(path.join(__dirname+'/grafico.html'));		//con il metodo sendFile posso tornare al client un file html (la pagina grafico.html che hai fatto)
});

//nuova interfaccia con bootstrap
app.get('/graficoNew', function (req, res){
	 res.sendFile(path.join(__dirname+'/graficoNew.html'));		
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
app.get('/getLastValue', function (req, res) {
  MongoClient.connect(mongodbsettings.url, function(err, db) {
  if(err)
    {
      console.log("Errore connessione al database: "+err.message);
    }
  else
    {
      //FINALMENTE!! CONNESSO
      console.log('Connessione stabilita to', mongodbsettings.url);

          var collection = db.collection('sensor');
          collection.find().sort({"_id":-1}).limit(1).toArray(function(err, lastSensorValue){
            if (err)
            {
              console.log("Errore"+err.message);
            } else
            {
                console.log(lastSensorValue);
                res.send(lastSensorValue);
            }
			db.close();
        });
    }
  });
});



//metodo per avere tutti i valori ricevuto dal database richiamabile da browser: http://localhost:3000/getAllValue
app.get('/getAllValue', function (req, res){

  MongoClient.connect(mongodbsettings.url, function(err, db) {
  if(err)
    {
      console.log("Errore connessione al database: "+err.message);
    }
  else
    {
      //FINALMENTE!! CONNESSO
      console.log('Connessione stabilita to', mongodbsettings.url);

          var collection = db.collection('sensor');
          collection.find(/*{value:'12'}*/).toArray(function(err, allSensorValue) {
            if (err) {
              console.log("Errore"+err.message);
            } else {allSensorValue
                console.log(allSensorValue);
                res.send(allSensorValue);
            }
			db.close();
          });
    }
  });
});

// **************** Fine metodi richiamabili dal browser ****************




// **************** MOSCA CONFIGURATION - INIZIO CODICE BROKER MQTT ****************

	var settings = {
	  port: 1122,
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
client = mqtt.createClient(1122, 'localhost');

/*subscribe to a topic named 'MIO_TOPIC'*/
client.on('connect', function() { // When connected
	client.subscribe('topicDemo');

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
