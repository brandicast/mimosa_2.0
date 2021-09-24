let config = require ('./config_brandon.js') ;
let gw = require('./gateway_manager.js');

gw.start(config.gateway.port);
