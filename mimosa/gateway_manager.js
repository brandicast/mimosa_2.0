const config = require('./config_brandon.js');
let net = require('net');

let ph = require("./protocol_handler_philio.js");
let notifier = require('./notifier.js');

const log4js = require("log4js");
log4js.configure(config.log4js_set);
const logger = log4js.getLogger("Gateway_Manager");

let server = net.createServer(function (socket) {
  logger.info('Client Connected ' + socket.address().address + " :" + socket.address().port);
  socket.setTimeout(0);

  socket.on('data', function (data) {

    logger.debug ("[Raw Data] " +  data);

    var newData = new String(data).replace('\0', '').split("\n");

    for (var i = 0; i < newData.length; i++) {
      var processData = newData[i].trim();
      if (processData.length > 0) {

        try {
          dataJson = JSON.parse(processData);
        }
        catch (e) {
          logger.debug(e.code + ":" + e.message);
          logger.debug(e.stack);
          logger.error("[EXCEPTION] " + "#" + processData + "#");
          dataJson = null;
        }
        if (dataJson != null && dataJson.mac)  {
          event_msg = ph.protocolHandler(dataJson);
          if (event_msg.length > 0)
            notifier.sendMessageToAll(event_msg);

            logger.debug (JSON.stringify(dataJson));
          var mac = dataJson.mac ;
          var uid = dataJson.eventLog[0].uid ;
          var funcType = dataJson.eventLog[0].funcType ;
          var mqtt_topic = config.mqtt.topic_prefix + "/" + mac  + "/" + uid + "/" + funcType ;
          notifier.sendMessage(mqtt_topic,JSON.stringify(dataJson.eventLog[0]));
        }
        else {
          logger.info ("[NOTE]  This is something not handle : " +  processData) ;
        }
      }
    }
  });

  socket.on('error', function (data) {
    logger.error(data);
  })

});

exports.start = function (port) {
  server.listen(port, function () {
    logger.info('Gateway Service listen on ' + port);
  });
};