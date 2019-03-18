/**
 * Created by iGuru on 2018-12-01.
 */
const logger = require('../console-logger');
class Humidity {
    constructor(name, id, value) {
        this.name = name;
        this.id = id;
        this.value = value;
    }
    print(formattedDate, formattedTime, isDayOld, byDays){
        let speechResp = '';
        if (isDayOld) {
            speechResp = `<speak>Humidity recorded is ${byDays} old
                        <break time="100ms"/> on
                        <say-as interpret-as="date" format="dm">${formattedDate}</say-as>
                            <break time="100ms"/> at \
                        <say-as interpret-as=\"time\"> ${formattedTime} </say-as>
                            <break time=\"300ms\"/> 
                        is ${parseInt(this.value)} %
                        <break time="300ms"/>Please check your sensor battery 
                        </speak>`;
            logger.log('DEBUG', `Humidity is ${speechResp}`);
        }else {
            speechResp = `<speak>Humidity recorded on
                            <say-as interpret-as="date" format="dm">${formattedDate}</say-as>
                                <break time="100ms"/> at \
                            <say-as interpret-as=\"time\"> ${formattedTime} </say-as>
                                <break time=\"300ms\"/> 
                            is ${parseInt(this.value)} % </speak>`;
            logger.log('DEBUG', `Humidity is ${speechResp}`);
        }
        return speechResp;
    };
    getId() {
        return this.id;
    };
    getValue() {
        return this.value;
    }
    setValue(val) {
        this.value = val;
    }
}
var method = {};

method.createHumidity = function(name, value, id) {
    return new Humidity(name, id, value);
};

module.exports = method;


