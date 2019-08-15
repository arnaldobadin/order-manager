const config = require("../../const/config.js");

const Server = require("../../lib/server.js");

const Interface = function(actuator) {
	this.actuator = actuator;
	this.server = new Server(config.interface.port);

	this.setup();
}

Interface.prototype.setup = function() {
	this.server.setRoute(Server.METHODS.GET, "/status",
		(request, response) => {
			const payload = Server.LAYOUTS.SUCCESS();
			return response.status(200).send(payload);
		}
	);
}

Interface.prototype.start = function() {
	return this.server.start();
}

Interface.prototype.stop = function() {
	return this.server.stop();
}

module.exports = Interface;