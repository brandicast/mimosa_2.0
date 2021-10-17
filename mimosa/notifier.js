const config = require("./config.js");

let mqtt = null ;

if (config.mqtt.enable)
    mqtt = require ("./mqtt_notify.js");


exports.sendMessageToAll  = function (message) {
    if (mqtt)
        mqtt.sendMessageToAll (message) ;   
}

exports.sendMessage = function (topic, message) {
    mqtt.sendMessage(topic, message) ;
}
