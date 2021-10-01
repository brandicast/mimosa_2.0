
let config = require("./config.js");
const log4js = require("log4js");
log4js.configure(config.log4js_set);
const logger = log4js.getLogger("LineBot_Handler");

let linebot = require('linebot');
const fs = require("fs");
const path = require("path");

let bot = linebot(config.linebot.configuration);

var notifier = null;
var database = null;

//var user_id_array = ['U17f3c29570cb4be181aa7e82b86b3ba7'];
var MEMBERS = {};

/*  
    Reference :  See sample message in the bottom
  
*/
bot.on('message', function (event) {
    logger.debug(event);
    event.reply (event.message) ;
    /*
    switch (event.type){
        case "message" :{
            event.reply("echo :" + event.message.text);
            break ;
        }
        case "sticker":{

        }
    }
    switch (event.message.text) {
        case "(STATUS)": {
            let msg = "";
            if (database)
                msg = JSON.stringify(database);
            if (notifier)
                notifier.sendMessageToAll(msg);
            else
                event.reply(msg);
            break;
        }
        default: {
            if (notifier)
                notifier.sendMessageToAll(msg);
            else
                event.reply("echo :" + event.message.text);
            break;
        }
    }
    */
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
    if (Object.keys(MEMBERS).length>0) {
        bot.push(Object.keys(MEMBERS), sendMsg);    
        logger.info('send: ' + Object.keys(MEMBERS) + ':' + sendMsg);
    }
    else
    {
        logger.info ('No member found') ;
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

function writeMemberProfiles (){
    profile_filename = path.join(__dirname, config.linebot.resource_folder, config.linebot.member_profile);
    fs.writeFileSync(profile_filename, JSON.stringify(MEMBERS));

}

/****************************************************************************
 *    Main Start
 ****************************************************************************/
 loadMemberProfiles() ;

bot.listen('/', config.linebot.port);



exports.setNotifier = function (nf) {
    notifier = nf;
}

exports.setInfoDatabase = function (db) {
    database = db;
}


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