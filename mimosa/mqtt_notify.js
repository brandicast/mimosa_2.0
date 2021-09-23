var config  = require('./config.js');
const log4js = require("log4js");
log4js.configure (config.log4js_set) ;
const logger =  log4js.getLogger("MQTT Notify") ;

var mqtt  = require ('mqtt');

var opt =  {
    port:config.mqtt.port,
    clientId: 'nodejs'
};

var client = mqtt.connect (config.mqtt.url, opt);

client.on ('connect', function ()  {
    console.log ('Connected to MQTT broker') ;
 //   client.subscribe ('brandon/test') ;
}
);

client.on ('message', function (topic, msg){
    console.log ('Receiving from [' + topic + '] with message : ' + msg)
});




exports.sendMessageToAll = function (msg) {
    client.publish(config.mqtt.topic, msg);
}