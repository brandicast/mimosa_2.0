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
        },
        line_notify: {
                enable: false,
                client_id: '',  // your client id goes here
                client_secret: '',   // your secret goes here
                redirect_uri: 'http://192.168.0.15:8888/code_receiver',   // this is for redirect page
                success_page: './success.html',
                express_options: {root:'.'},
                token_file: "./token_list.json",   // this is for keep subscriber's token
                port: 8888
        }
}