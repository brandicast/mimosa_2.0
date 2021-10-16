var config  = require('./config_brandon.js');
var g = require('./globals.js');
const log4js = require("log4js");
log4js.configure (config.log4js_set) ;
const logger =  log4js.getLogger("MQTT Notify") ;

var mqtt  = require ('mqtt');

var opt =  {
    port:config.mqtt.port,
    clientId: 'nodejs'
};

var client = mqtt.connect (config.mqtt.url, opt);

// Listen to any command from MQTT to perform action.
// Subscribe to the topic config.mqtt.topic_cmd
client.on ('connect', function ()  {
    console.log ('Connected to MQTT broker') ;
    client.subscribe (config.mqtt.topic_cmd) ;
}
);

// This is the action to perform when receiving command from config.mqtt.topic_cmd
client.on ('message', function (topic, msg){
    console.log ('Receiving from [' + topic + '] with message : ' + msg)
    ///  To be do.
});

function sendMsg(topic, msg){
    client.publish(topic,msg);
}



exports.sendMessageToAll = function (msg) {
    sendMsg(config.mqtt.topic_event, msg);
}

exports.sendMessage = function (topic, msg) {
    sendMsg(topic,msg);
}