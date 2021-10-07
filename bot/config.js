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
        linebot: {
                configuration: {
                        channelId: 123,
                        channelSecret: '',
                        channelAccessToken: ''
                }, 
                port: 9999,
                resource_folder: "./resources",
                member_profile: "member.json",
                welcome_join_string: "歡迎 $USER 的加入 !",
                welcome_string: "歡迎 $USER 回來 !",
                service_is_up_string: "濟南飯店不智慧小幫手回魂了!",
                service_not_support: "我還不會這個 ! 學習中 !!",
                no_data_string: "還沒有資料，請稍等 !" 
        },
        mqtt: {
                enable: true,
                url: 'mqtt://192.168.0.17',
                port: 1883,
                topic_event: 'brandon/iot/event',
                topic_all: 'brandon/iot/all',
                topic_cmdn: 'brandon/iot/command'

        },
        line_notify: {
                enable: true
        }
}