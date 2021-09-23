var lineReader = require('line-reader');
const fs = require('fs')

var data = ""
lineReader.eachLine('20200210.log', function (line, last) {

    if (line.startsWith('18:CC:23:00:4A:B4')) {
        x = line.substring('18:CC:23:00:4A:B4 :'.length)
        x = '{"mac":"18:CC:23:00:4A:B4","eventLog":[' + x + ']}';
        //console.log(x);
        data += x + "\n";
        y = JSON.parse(x);
        // console.log (y.mac);
        // console.log (y.eventLog[0].eventCode);

    }

    if (last) {
        try {
           fs.writeFileSync('20210923.log', data)
            //file written successfully
        } catch (err) {
            console.error(err)
        }
    }      
});


