const Actuator = require("../lib/actuator.js");
const Context = require("./context/context.js");
const Interface = require("./interface/interface.js");

const Engine = function() {
	this.actuator = new Actuator();
	this.interface = new Interface(this.actuator);
	this.context = new Context();

	this.status = false;
}

Engine.prototype.start = async function() {
	if (this.status) return false;
	this.status = true;

	await this.context.start();
	this.interface.start();
	return true;
}

Engine.prototype.stop = function() {
	if (!this.status) return false;
	this.status = false;

	this.interface.stop();
	this.context.stop();
	return true;
}

module.exports = Engine;