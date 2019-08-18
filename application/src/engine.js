const Actuator = require("../lib/actuator.js");
const Context = require("./context/context.js");
const Interface = require("./interface/interface.js");
const Manager = require("./manager/manager.js");

const Engine = function() {
	this.actuator = new Actuator();
	this.context = new Context();
	this.manager = new Manager(this.actuator, this.context);
	this.interface = new Interface(this.actuator);

	this.status = false;
}

Engine.prototype.start = async function() {
	if (this.status) return false;
	this.status = true;

	if (!await this.context.start()) throw new Error("Can't start context module.");
	if (!this.manager.start()) throw new Error("Can't start manager module.");
	if (!await this.interface.start()) throw new Error("Can't start interface module.");

	return true;
}

Engine.prototype.stop = function() {
	if (!this.status) return false;
	this.status = false;

	this.interface.stop();
	this.manager.stop();
	this.context.stop();
	return true;
}

module.exports = Engine;