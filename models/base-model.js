/**
 * Created by iGuru on 2018-12-02.
 */

const method = {};
const BaseModel = {
    feeds: {
        'room': {
            'backyard': '/feeds/backyard',
            'livingroom': '/feeds/livingroom',
            'basement': '/feeds/basement',
            'second-floor': '/feeds/second-floor'
        },
        'temperature': {
            'temperature': '.temperature',
            'humidity': '.humidity',
            'hottubtemperaure': '.hottubtemprature'
        },
        'salt': {
            'salt-level-status': '.salt-level-status'
        }
    },
    USER_NAME: "ginamdar",
    LAST_KNOWN_FEED_VALUE: '/data?limit=1&include=created_at,value,id',
    API_V2: '/api/v2/'
};

method.createBase = function() {
    return Object.create(BaseModel);
};

module.exports = method;