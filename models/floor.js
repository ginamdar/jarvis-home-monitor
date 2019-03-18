/**
 * Created by iGuru on 2018-12-01.
 */
const logger = require('../console-logger');
class Floor {
  constructor(name, id, value) {
    this.name = name;
    this.id = id;
    this.value = value;
  }
  print(){
    logger.log('DEBUG', `Floor is ${this.name} and value: ${this.value}`)
  };
  getId() {
    return this.id;
  };
  getValue() {
    return this.value;
  }
}
var method = {};

method.createFloor = function(name, value, id) {
  return new Floor(name, id, value);
};

module.exports = method;


