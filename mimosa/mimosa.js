let config = require ('./config.js') ;
let gw = require('./gateway_manager.js');

gw.start(config.gateway.port);
