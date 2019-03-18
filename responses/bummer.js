/**
 * Created by iGuru on 2018-12-01.
 */

var bummer = {};
bummer.bummer = function (message) {
  const response = {
    "version": "1",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": '<speak><say-as interpret-as=\"interjection\">message</say-as></speak>',
        "playBehavior": "REPLACE_ENQUEUED"
      }
    },
    "shouldEndSession": true
  }
  return response;
};

module.exports = bummer;