var moment = require('moment-timezone');
var dateUtil = {};

dateUtil.formatDateTime = (createdDate, timeZone, format) => {
    // const formattedTime = moment.utc(resp.created_at).tz('America/Toronto').format('hh:mm A');
    // dddd DD MMMM
    //America/Toronto
    return moment.utc(createdDate).tz(timeZone).format(format); // Monday 1 December
};

module.exports = dateUtil;