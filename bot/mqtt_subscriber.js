var config  = require('./config_brandon.js');
var g = require('./globals.js');
const log4js = require("log4js");
log4js.configure (config.log4js_set) ;
const logger =  log4js.getLogger("MQTT Subscriber in BOT") ;

let g = require ("./globals.js");

var mqtt  = require ('mqtt');

var opt =  {
    port:config.mqtt.port,
    clientId: 'bot'
};

var client = mqtt.connect (config.mqtt.url, opt);

// Listen to any command from MQTT to perform action.
// Subscribe to the topic config.mqtt.topic_cmd
client.on ('connect', function ()  {
    console.log ('Connected to MQTT broker') ;
    client.subscribe (config.mqtt.topic_all) ;
    client.publish (config.mqtt.topic_cmdn,"(STATUS)") ;  
}
);

// This is the action to perform when receiving command from config.mqtt.topic_cmd
client.on ('message', function (topic, msg){
    console.log ('Receiving from [' + topic + '] with message : ' + msg)
    g.database = msg ;
});

