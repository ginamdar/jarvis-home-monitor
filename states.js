var _ = require('lodash');

var states = {};
const DIALOG_STATES = {
    "STARTED" : "STARTED",
    "IN_PROGRESS": "IN_PROGRESS",
    "COMPLETED" : "COMPLETED"
};

states.dialogStates = ()=> {
    return _.values(DIALOG_STATES);
};

states.isCompleted = (alexaDialogState) => {
    return alexaDialogState === DIALOG_STATES.COMPLETED
};

module.exports = states;