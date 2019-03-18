var intents = {};

intents.supportedIntents = () => {
  return [
      'FloorAndTemperatureIntent',
      'SoftenerSaltLevelIntent',
      'BackyardIntent'
  ]
};

intents.FloorAndTemperatureIntent = () => {
    return 'FloorAndTemperatureIntent'.toLowerCase()
};

intents.SoftenerSaltLevelIntent = () => {
    return 'SoftenerSaltLevelIntent'.toLowerCase();
};

intents.BackyardIntent = () => {
    return 'BackyardIntent'.toLowerCase();
};

module.exports = intents;