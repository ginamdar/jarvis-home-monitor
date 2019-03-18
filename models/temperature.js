/**
 * Created by iGuru on 2018-12-01.
 */
const logger = require('../console-logger');
class Temperature {
    constructor(name, id, value, locale) {
        this.name = name;
        this.id = id;
        this.value = value;
        this.locale = locale;
    }
    localeBasedConversion() {
        if (this.value && this.locale === 'en-US') {
            return parseInt((this.value * 9/5) + 32) + " degrees fahrenheit";
        }
        return parseInt(this.value) + " degrees celsius";
    }
    print(formattedDate, formattedTime, isDayOld, byDays){
        let speechResp = '';
        if (isDayOld) {
            speechResp = `<speak>Temperature recorded is ${byDays} old
                            <break time="100ms"/> on
                            <say-as interpret-as="date" format="dm">${formattedDate}</say-as>
                                <break time="100ms"/> at \
                            <say-as interpret-as=\"time\"> ${formattedTime} </say-as>
                                <break time=\"300ms\"/> 
                            is ${this.localeBasedConversion()} degrees celsius.
                            <break time="300ms"/>Please check your sensor battery 
                            </speak>`;
        }else {
            speechResp = `<speak>Temperature recorded on
                            <say-as interpret-as="date" format="dm">${formattedDate}</say-as>
                                <break time="100ms"/> at \
                            <say-as interpret-as=\"time\"> ${formattedTime} </say-as>
                                <break time=\"300ms\"/> 
                            is ${this.localeBasedConversion()}  </speak>`;
            logger.log('DEBUG', `Temperature is ${speechResp}`);
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

method.createTemperature = function(name, value, id, locale) {
    return new Temperature(name, id, value, locale);
};

module.exports = method;