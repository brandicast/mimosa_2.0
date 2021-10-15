module.exports = {
        log4js_set: {
                appenders: {
                        out: {
                                type: 'stdout'
                        },
                        app: {
                                type: 'file',
                                filename: 'logs/mimosa',
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
                url: 'mqtt://192.168.0.120',
                port: 1883,
                topic_cmd: 'brandon/iot/zwave/philio/cmd',
                topic_prefix : 'brandon/iot/zwave/philio/event'   // To fit into mqtt model, user {prefix}/{uid}/{event}
        }
}