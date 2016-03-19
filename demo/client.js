/*eseguendo questo file invio un messaggio sul topic MIO_TOPIC sul quale è in ascolto il mio server
sto quindi simulando l'invio di un valore del sensore da Arduino.*/

var mqtt = require('mqtt')

/*connect to the server*/
var client  = mqtt.connect({ host: 'localhost', port: 1883 });

/*subscribe to a topic named 'presence'*/
//client.subscribe('presence'); 		//non serve che il publisher si sottoscriva al topic

client.on('connect', function() { // When connected

  // publish a message sul topic: "MIO_TOPIC"
  var message={'type':'temperature', 'value': '12'};	//scelgo JSON per il formato di invio dei dati MQTT 
  client.publish('MIO_TOPIC', JSON.stringify(message), function() {
    console.log("Message is published");
    client.end(); // Close the connection when published
  });
});
