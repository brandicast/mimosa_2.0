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

client.on ('connect', function ()  {
    console.log ('Connected to MQTT broker') ;
    client.subscribe ('brandon/iot/command') ;
}
);

client.on ('message', function (topic, msg){
    console.log ('Receiving from [' + topic + '] with message : ' + msg)
    if (msg == "(STATUS)"){
        sendMsg (config.mqtt.topic_all, JSON.stringify(g.database));
    }
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