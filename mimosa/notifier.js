const config = require("./config.js");

let line_notify = null;
let mqtt = null ;

if (config.line_notify.enable)
    line_notify = require ("./line_notify.js") ;
if (config.mqtt.enable)
    mqtt = require ("./mqtt_notify.js");


exports.sendMessageToAll  = function (message) {
    if (line_notify)
        line_notify.sendMessageToAll (message) ;
    if (mqtt)
        mqtt.sendMessageToAll (message) ;
    
}

exports.setInfoDatabase  = function (db) {
    line_notify.setInfoDatabase (db) ;
}