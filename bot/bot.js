
let config = require("./config.js");
const log4js = require("log4js");
log4js.configure(config.log4js_set);
const logger = log4js.getLogger("LineBot_Handler");

let linebot = require('linebot');
const fs = require("fs");
const path = require("path");

let composer = require ("./line_message_formatter.js") ;
let message = require("./resources/line_message_template.js");

const subscriber = require("./mqtt_subscriber.js");

let bot = linebot(config.linebot.configuration);


var MEMBERS = {};

/*  
    Reference :  See sample message in the bottom
  
*/
bot.on('message', function (event) {
    var response ; // get text json from template
    switch (event.message.type) {
        case "text": {
            var text = event.message.text;
            logger.debug("TEXT = : " + text); 
            switch (text) {
                case "(STATUS)": {
                    response = Object.assign({}, message.flex.common);
                    var carousel = Object.assign({}, message.flex.container.carousel);
                    response.contents = carousel ;
                    var bubbles = [];
                    bubbles[0] = Object.assign({}, message.flex.container.bubble);
                    bubbles[1] = Object.assign({}, message.flex.container.bubble);
                    bubbles[0].body.contents[0].text = "I am bubble 1";
                    bubbles[1].body.contents[0].text = "I am bubble 2";
                    carousel.contents = bubbles;
                    logger.debug(JSON.stringify(response));
                    break;
                }
                case "(SINGLE)": {
                    response = Object.assign({}, message.flex.common);
                    var bubble = Object.assign({}, message.flex.container.bubble);
                    bubble.body.contents[0].text = "I am bubble 1";
                    response.contents = bubble ;
                    logger.debug(JSON.stringify(response));
                    break; 
                }
                case "(status)" : {
                    response = composer.getStatus();
                    break;
                }
                case "(raw)" :{
                    response = composer.getRawData() ;
                    break;
                }
                default: {
                    response =  Object.assign({}, message.text); 
                    response.text = "ECHO : " +  event.message.text ;
                    break;
                }
            }

            break;
        }
        case "sticker": {
            response = Object.assign({},  message.sticker); ;
            if (event.message.packageId == "1")
                response.stickerId = event.message.stickerId;
            break;
        }
        case "location" :{
            response.text = event.message.address + " (" + event.message.latitude + "," + event.message.longitude + ")" ;
            break
        }
        case "image":  default : {
            response.text = config.linebot.service_not_support ;
            break ;
        }
    }

    response["quickReply"] = message.quickReply ;
    event.reply(response);
 
});


bot.on('leave', function (event) {
    logger.debug(event);
    unregisterMember(event.source.userId);
})

bot.on('join', function (event) {
    logger.debug(event);
    event.source.profile().then(function (profile) {
        registerMember(profile);
        var msg = config.linebot.welcome_join_string.replace("$USER", profile.displayName);
        event.reply(msg);
    });
})

bot.on('follow', function (event) {
    logger.debug(event);
    event.source.profile().then(function (profile) {
        registerMember(profile);
        var msg = config.linebot.welcome_string.replace("$USER", profile.displayName);
        event.reply(msg);
    });
})

bot.on('unfollow', function (event) {
    logger.debug(event);
    unregisterMember(event.source.userId);


})

function registerMember(profile) {
    var p = {};
    p["userId"] = profile.userId;
    p["displayName"] = profile.displayName;
    p["language"] = profile.language;
    p["pictureUrl"] = profile.pictureUrl;
    p["statusMessage"] = profile.statusMessage;
    MEMBERS[profile.userId] = p;

    logger.debug(JSON.stringify(MEMBERS));
    logger.debug("MEMBERS are: " + Object.keys(MEMBERS));

    writeMemberProfiles();

}

function unregisterMember(userId) {
    delete MEMBERS[userId];
    logger.debug(JSON.stringify(MEMBERS));
}


setTimeout(function () {
    var sendMsg = config.linebot.service_is_up_string;
    if (Object.keys(MEMBERS).length > 0) {
        bot.push(Object.keys(MEMBERS), sendMsg);
        logger.info('send: ' + Object.keys(MEMBERS) + ':' + sendMsg);
    }
    else {
        logger.info('No member found');
    }

}, 3000);


// Read available member profiles
function loadMemberProfiles() {

    fs.stat(config.linebot.resource_folder, (err, stat) => {
        if (err) {
            fs.mkdirSync(config.linebot.resource_folder);
        }
    });

    profile_filename = path.join(__dirname, config.linebot.resource_folder, config.linebot.member_profile);

    //  Asyn API to check file existence isn't a good practice in this case.  Need to change later.
    fs.stat(profile_filename, (err, stat) => {
        if (err) {
            fs.writeFileSync(profile_filename, JSON.stringify(MEMBERS));
        } else {
            raw_json = fs.readFileSync(profile_filename, "utf-8");
            if (raw_json) {
                MEMBERS = JSON.parse(raw_json);
            } else
                MEMBERS = {};
        }
    });
}

function writeMemberProfiles() {
    profile_filename = path.join(__dirname, config.linebot.resource_folder, config.linebot.member_profile);
    fs.writeFileSync(profile_filename, JSON.stringify(MEMBERS));

}

/****************************************************************************
 *    Main Start
 ****************************************************************************/
loadMemberProfiles();

bot.listen('/', config.linebot.port);

logger.info('Running on : ' + config.linebot.port);





/*
[Text]
{
  type: 'message',
  message: {
    type: 'text',
    id: '14839608892725',
    text: 'Hi',
    content: [Function (anonymous)]
  },
  timestamp: 1633076934007,
  source: {
    type: 'user',
    userId: 'U17f3c29570cb4be181aa7e82b86b3ba7',
    profile: [Function (anonymous)],
    member: [Function (anonymous)]
  },
  replyToken: 'c2d00beadb624f4ab48dcc8b6bd6a22c',
  mode: 'active',
  reply: [Function (anonymous)]
}



[Sticker]

 {
  type: 'message',
  message: {
    type: 'sticker',
    id: '14839571160316',
    stickerId: '13',
    packageId: '1',
    stickerResourceType: 'STATIC',
    keywords: [
      'thumb',    'nice',
      'thumbsup', 'good',
      'moon',     'cool',
      'OK',       'goodjob',
      'Awesome'
    ],
    content: [Function (anonymous)]
  },
  timestamp: 1633076497146,
  source: {
    type: 'user',
    userId: 'U17f3c29570cb4be181aa7e82b86b3ba7',
    profile: [Function (anonymous)],
    member: [Function (anonymous)]
  },
  replyToken: '7254a3d1a4c94a9e9df978744a920a8b',
  mode: 'active',
  reply: [Function (anonymous)]
}

 [Image]

 { type: 'message',
  message: {
    type: 'image',
    id: '14839575573040',
    contentProvider: { type: 'line' },
    content: [Function (anonymous)]
  },
  timestamp: 1633076548764,
  source: {
    type: 'user',
    userId: 'U17f3c29570cb4be181aa7e82b86b3ba7',
    profile: [Function (anonymous)],
    member: [Function (anonymous)]
  },
  replyToken: '1c4cd9cf028a41c89029b9d247ce0b14',
  mode: 'active',
  reply: [Function (anonymous)]
}


*/