/**
 * Created by iGuru on 2018-12-01.
 */

var Slot = {};
Slot.elicitSlot = function(slotName) {
  // "outputSpeech": {
  //   "type": "PlainText",
  //     "text": "From where did you want to start your trip?"
  // },
  let elicitVoiceSpeech = '';
  slotName = slotName.toLowerCase();
  if (slotName === 'room') {
    elicitVoiceSpeech = "<speak>Can you specify which " +
      "<prosody volume='x-loud' rate='slow'>floor</prosody>" +
      "you want to check</speak>"
  }else if(slotName === 'temperature') {
    elicitVoiceSpeech = "<speak>Can you specify which data you wish to monitor" +
      "<break time='100ms'></break><prosody volume='x-loud' rate='slow'>Temperature Or Humidity</prosody> </speak>"
  }else if (slotName === 'jacuzzi') {
      elicitVoiceSpeech = "<speak>Can you specify which device in the backyard you wish to monitor" +
          "<break time='100ms'></break><prosody volume='x-loud' rate='slow'>Jacuzzi or something else</prosody> </speak>"
  }
  const elicitSlotResp = {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "playBehavior": "REPLACE_ENQUEUED",
        "ssml": elicitVoiceSpeech
        // "text": "Can you specify which floor you want to check the details?"
      },
      "directives": [
        {
          "type": "Dialog.ElicitSlot",
          "slotToElicit": slotName
        }
      ],
      "shouldEndSession": false
    }
  };
  return elicitSlotResp;
};

module.exports = Slot;