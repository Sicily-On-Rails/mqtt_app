var mosca = require('mosca')

var pubsubsettings = {
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'myCollections',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: pubsubsettings
};

/*START MOSCA*/
var server = new mosca.Server(settings);
server.on('ready',setup);

/*Fired when the mqtt server is ready*/
function setup() {
  console.log('Mosca server is up and running')
}

/*Fired when client is connected-client is passed a parameter*/
server.on('clientConnected',function(client){
  console.log('client connected',client.id);
});

/*Fired when a message is received-the packet and client are passed as parameters*/
server.on('published',function(packet, client){
  console.log('Published : ',packet.payload);
});

/*Fired when a client subscribe to a topic-the topic and client are passed as parameters*/
server.on('subscribed',function(topic,client){
  console.log('subscribed: ', topic);
});
server.on('unsubscribed',function(topic,client){
  console.log('unsubscribed: ', topic);
});

/*Fired when a client is disconnecting-the client is passed a parameter*/
server.on('clientDisconnecting',function(client){
  console.log('client disconnecting: ',client.id);
});
server.on('clientDisconnected',function(client){
  console.log('client disconnected: ',client.id);
});
