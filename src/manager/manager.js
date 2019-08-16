const Sync = require("../../lib/sync.js");
const Types = require("../../lib/types.js");

const Manager = function(actuator, context) {
	this.actuator = actuator;
	this.context = context;

	this.status = false;

	this.setup();
}

Manager.prototype.setup = function() {
	this.actuator.set("manager-insert-order", (...params) => {return this.insertOrder(...params);});
}

Manager.prototype.start = function() {
	if (this.status) return false;
	this.status = true;

	return true;
}

Manager.prototype.stop = function() {
	if (!this.status) return false;
	this.status = false;

	return true;
}

Manager.prototype.insertOrder = function(name, contact, pid, shipping, callback) {
	
}

module.exports = Manager;
