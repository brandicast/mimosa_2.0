module.exports = {
    log4js_set: {
            appenders: {
                    out: {
                            type: 'stdout'
                    },
                    app: {
                            type: 'file',
                            filename: 'logs/line_notify_agent.log',
                            maxLogSize: 4096000,
                            backups: 9
                    }
            },
            categories: {
                    default: {
                            appenders: ['out', 'app'],
                            level: 'debug'
                    }
            }
    },
    gateway: {
            port: 9613
    },
    mqtt: {
            enable: true,
            url: 'mqtt://192.168.0.18',
            opt :{
                port:1883,
                clientId: 'line_notify_agent'
            },
            topic : 'brandon/iot/zwave/philio/event/#'   // To fit into mqtt model, user {prefix}/{uid}/{event}
    },
    line_notify_service: {
            enable: false,
            url: 'http://192.168.0.16:8888/sendMsg',
            service: 'Generic_Bot' 
    }
}