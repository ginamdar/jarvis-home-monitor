var https = require('https');
var dateutil = require('../utils/date-util');
// var moment = require('moment-timezone');
var logger = require('../console-logger');
const HOST = "io.adafruit.com";
const API_KEY = "<<Adafruit API Key>>";
// "/feeds/backyard.hottubtemprature/data?limit=1&include=created_at,value,id";
var methods = {};


methods.getData = function (feedName, modelObject, callback) {
    var object = createHttpObject(feedName);
    let responseData = '';

    logger.log('DEBUG', `Inside getTemperatureData: ${JSON.stringify(object)}`);
    var req = https.request(object, (res) => {
        res.setEncoding('utf8');
        logger.log('DEBUG', `Status: ` + res.statusCode);

        res.on('data', (chunk) => {
            responseData = responseData + chunk;
            logger.log('DEBUG', 'Body: ' + responseData);
        });
        res.on('end', () => {
            logger.log('DEBUG', `End of request`);
            const resp = generateResponse(JSON.parse(responseData), modelObject);
            return callback(null, resp);
        })

    });
    req.on('error', (err) => {
        logger.log('DEBUG', 'Error in request:' + JSON.stringify(err));
    });

    req.end();
};

function generateResponse(respData, model) {
    const resp = respData[0];
    logger.log('DEBUG', resp.value + " createdAt:" + resp.created_at);
    model.setValue(resp.value);
    const dateInEST = moment.utc(resp.created_at).tz('America/Toronto');
    const formattedDate = dateInEST.format('dddd DD MMMM ');
    const formattedTime = dateInEST.format('hh:mm A');
    const now = moment.utc(new Date()).tz('America/Toronto');
    let voiceRsp = '';
    if (dateInEST.isBefore(now, 'day')) {
        voiceRsp = model.print(formattedDate, formattedTime, true, dateInEST.fromNow(true));
    }else {
        voiceRsp = model.print(formattedDate, formattedTime);
    }
    const response = {
        "version": "1",
        "response": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": voiceRsp,
                "playBehavior": "REPLACE_ENQUEUED"
            }
        },
        "shouldEndSession": true
    };
    logger.log('DEBUG', `Returning response ${response}`);
    return response;
}

function createHttpObject(feedName) {

    const get_options = {
        host: HOST,
        method: 'GET',
        path: feedName,
        headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': API_KEY
        }
    };
    return get_options;
}

module.exports = methods;
