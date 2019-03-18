/**
 * Created by iGuru on 2018-12-03.
 */
const logger = require('../console-logger');
class Salt {
    constructor(name, id, value) {
        this.name = name;
        this.id = id;
        this.value = value;
    }
    print(formattedDate, formattedTime, isDayOld, byDays){
        // Water Softener is has marking 1-7, where 7 being max filled. And
        // sensor actually measure the distance using ultrasonic trigger
        // which is basically ~25 - 8 inch, where 8 means salt is at level 7
        const saltLevel = Math.round(this.map(this.value, 8, 25, 1, 7));
        const saltPercent = 100 - Math.round((saltLevel / 7) * 100);
        let speechResp = '';
        if (isDayOld) {
            speechResp = `<speak>Water softener salt level recorded is ${byDays} old
                            <break time="100ms"/> on
                            <say-as interpret-as="date" format="dm">${formattedDate}</say-as>
                                <break time="100ms"/> at \
                            <say-as interpret-as=\"time\"> ${formattedTime} </say-as>
                                <break time=\"300ms\"/> 
                            is ${saltPercent} %.
                            <break time="300ms"/>Please check your sensor battery 
                            </speak>`;
            logger.log('DEBUG', `Humidity is ${speechResp}`);
        }else {
            speechResp = `<speak>Water softener salt level recorded on
                            <say-as interpret-as="date" format="dm">${formattedDate}</say-as>
                                <break time="100ms"/> at \
                            <say-as interpret-as=\"time\"> ${formattedTime} </say-as>
                                <break time=\"300ms\"/> 
                            is ${saltPercent} % </speak>`;
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

    map( x,  in_min,  in_max,  out_min,  out_max){
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
}
var method = {};

method.createSalt = function(name, value, id) {
    return new Salt(name, id, value);
};

module.exports = method;


