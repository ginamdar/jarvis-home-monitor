var logger = require('./console-logger');
var states = require('./states');
var intents = require('./intents/intents');
var confirmSlot = require('./responses/elicit-slot');
var bummer = require('responses/bummer');
var floor = require('./models/floor');
var humidity = require('./models/humidity');
var temperature = require('./models/temperature');
var salt = require('./models/salt');
var _ = require('lodash');
var api = require('./api/adafruit-api');
var baseModel = require('./models/base-model');

exports.handler = (request, context, callback) => {
    logger.log('DEBUG', `request: ${JSON.stringify(request)}`);
    if (request.session.application.applicationId !== 'amzn1.ask.skill.0b81c7a6-863c-4f5c-b43c-fb96700569ac') {
        return callback(null);
    }
    const dialogState = request.dialogState;
    const intent = request.request.intent;
    const locale = request.request.locale;
    return validateAndCaptureIntentData(dialogState, intent, callback, locale);
    //return callback(null, confirmFloorSlotResp);
};

function validateAndCaptureIntentData(state, typeOfIntent, callback, locale) {
    // Check all the intents, their slot values, if missing Ask Alexa to prompt the user again
    if (!states.isCompleted(state)) {
        const modelsForTemperatureIntent = {};
        const modelsForSaltLevelIntent = {};
        logger.log('DEBUG', `typeOfIntent: ${JSON.stringify(typeOfIntent)}`);
        if (_.isEqual(typeOfIntent.name.toLowerCase(), intents.FloorAndTemperatureIntent())) {
            _.each(typeOfIntent.slots, (aSlot) => {
                logger.log('DEBUG', `aSlot: ${aSlot.name}`);
                const isValid = isValidSlot(aSlot);
                if (isValid) {
                    const value = getSlotValue(aSlot);
                    switch (aSlot.name) {
                        case 'room':
                            modelsForTemperatureIntent.room = floor.createFloor(value.name, aSlot.value, value.id);
                            break;
                        case 'temperature':
                            // This is user spoken value
                            if (aSlot.value.toLowerCase() === 'humidity') {
                                modelsForTemperatureIntent.temperature = humidity.createHumidity(value.name, aSlot.value,
                                    value.id);
                            } else {
                                modelsForTemperatureIntent.temperature = temperature.createTemperature(value.name,
                                    aSlot.value, value.id, locale);
                            }
                            break;
                        case 'default':
                            break;
                    }
                } else {
                    logger.log('DEBUG', `Making elicit slot dialog for ${aSlot.name}`);
                    return callback(null, confirmSlot.elicitSlot(aSlot.name));
                }
            });
        }
        else if (_.isEqual(typeOfIntent.name.toLowerCase(), intents.SoftenerSaltLevelIntent())) {
            const saltSlot = _.find(typeOfIntent.slots, (aSlot) => {
                return aSlot.name.toLowerCase() === 'salt_level';
            });
            if (!_.isEmpty(saltSlot)) {
                const isValid = isValidSlot(saltSlot);
                if (isValid) {
                    const value = getSlotValue(saltSlot);
                    modelsForSaltLevelIntent.salt = salt.createSalt(value.name, saltSlot.value, value.id);
                    modelsForSaltLevelIntent.room = floor.createFloor('basement', 'basement', 'basement');
                } else {
                    logger.log('DEBUG', `Making elicit slot dialog for ${saltSlot.name}`);
                    return callback(null, confirmSlot.elicitSlot(saltSlot.name));
                }
            }
        }
        else if (_.isEqual(typeOfIntent.name.toLowerCase(), intents.BackyardIntent())) {
            const jacuzziSlot = _.find(typeOfIntent.slots, (aSlot) => {
                return aSlot.name.toLowerCase() === 'jacuzzi';
            });
            if (!_.isEmpty(jacuzziSlot)) {
                const isValid = isValidSlot(jacuzziSlot);
                if (isValid) {
                    const value = getSlotValue(jacuzziSlot);
                    modelsForTemperatureIntent.room = floor.createFloor(value.name, jacuzziSlot.value, value.id);
                    modelsForTemperatureIntent.temperature = temperature.createTemperature('temperature',
                        'temperature', 'hottubtemperaure', locale);
                } else {
                    logger.log('DEBUG', `Making elicit slot dialog for ${jacuzziSlot.name}`);
                    return callback(null, confirmSlot.elicitSlot(jacuzziSlot.name));
                }
            }
        }
        else {
            logger.log('DEBUG', `this ${typeOfIntent.name} slot is not yet supported`);
            return callback(null, bummer.bummer('bummer!'));
        }
        //check if we got all the slots fullfilled
        // Make REST request and send response back to user
        if (modelsForTemperatureIntent.room && modelsForTemperatureIntent.temperature) {
            logger.log('DEBUG', `making adafruit request modelsForTemperatureIntent: 
            ${JSON.stringify(modelsForTemperatureIntent)}`);
            const BaseModel = baseModel.createBase();
            logger.log('DEBUG', `making adafruit request BaseModel.feeds: ${JSON.stringify(BaseModel.feeds)}`);
            const feedName = BaseModel.API_V2 + BaseModel.USER_NAME +
                BaseModel.feeds.room[modelsForTemperatureIntent.room.getId()] +
                BaseModel.feeds.temperature[modelsForTemperatureIntent.temperature.getId()] +
                BaseModel.LAST_KNOWN_FEED_VALUE;
            logger.log('INFO', `feedName: ${feedName}`);
            return api.getData(feedName, modelsForTemperatureIntent.temperature, callback);
        }
        if (modelsForSaltLevelIntent.room && modelsForSaltLevelIntent.salt) {
            logger.log('DEBUG', `making adafruit request modelsForSaltLevelIntent: ${JSON.stringify(modelsForSaltLevelIntent)}`);
            const BaseModel = baseModel.createBase();
            logger.log('DEBUG', `making adafruit request BaseModel.feeds: ${JSON.stringify(BaseModel.feeds)}`);
            const feedName = BaseModel.API_V2 + BaseModel.USER_NAME +
                BaseModel.feeds.room[modelsForSaltLevelIntent.room.getId()] +
                BaseModel.feeds.salt[modelsForSaltLevelIntent.salt.getId()] +
                BaseModel.LAST_KNOWN_FEED_VALUE;
            logger.log('INFO', `feedName: ${feedName}`);
            return api.getData(feedName, modelsForSaltLevelIntent.salt, callback);
        }
    }
}

function isValidSlot(slot) {
    let found = false;
    const resolutions = slot.resolutions;
    if (resolutions) {
        const resolutionsPerAuth = resolutions.resolutionsPerAuthority;
        logger.log('DEBUG', `resolutionsPerAuth[0]: ${JSON.stringify(resolutionsPerAuth[0])}`);
        if (resolutionsPerAuth[0].status.code === 'ER_SUCCESS_MATCH') {
            found = true;
        }
    }
    return found;
}

function getSlotValue(slot) {
    const resolutions = slot.resolutions;
    const resolutionsPerAuth = resolutions.resolutionsPerAuthority;
    const values = resolutionsPerAuth[0].values;
    return values[0].value;
}