const config = require("../../const/config.js");

const Server = require("../../lib/server.js");
const Sync = require("../../lib/sync.js");
const Types = require("../../lib/types.js");

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

Interface.prototype.start = async function() {
	let status = null;
	status = await Sync.wait(this.server.start, this.server);

	if (status.error || !(status.result)) return false;
	return true;
}

Interface.prototype.stop = async function() {
	let status = null;
	status = await Sync.wait(this.server.stop, this.server);

	if (status.error || !(status.result)) return false;
	return true;
}

module.exports = Interface;