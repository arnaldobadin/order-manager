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

	this.server.setRoute(Server.METHODS.POST, "/get-order",
		(request, response) => {
			const body = request.body;

			if (!Types.isValid(body)) {
				return response.status(400).json(Server.LAYOUTS.ERROR(400, "Missing body."));
			}

			const fields = ["id"];
			if (!Types.isComplete(body, fields)) {
				return response.status(400).json(
					Server.LAYOUTS.ERROR(400, `Body should contain: ${fields.join(", ")}.`)
				);
			}

			return this.actuator.execute("manager-get-order",
				body.id,
				(error, result) => {
					if (error || !(result && result.id)) {
						error = (Types.isType(error, Types.STRING) && error) || (error && JSON.stringify(error) || "Unknown error.");
						return response.status(400).json(
							Server.LAYOUTS.ERROR(400, error)
						);
					}

					const payload = Server.LAYOUTS.SUCCESS(`Order retrieved with success.`);
					payload.data = result;
					return response.status(200).json(payload);
				}
			);
		}
	);

	this.server.setRoute(Server.METHODS.POST, "/insert-order",
		(request, response) => {
			const body = request.body;

			if (!Types.isValid(body)) {
				return response.status(400).json(Server.LAYOUTS.ERROR(400, "Missing body."));
			}

			const fields = ["name", "contact", "pid", "shipping"];
			if (!Types.isComplete(body, fields)) {
				return response.status(400).json(
					Server.LAYOUTS.ERROR(400, `Body should contain: ${fields.join(", ")}.`)
				);
			}

			return this.actuator.execute("manager-insert-order",
				body.name, body.contact, body.pid, body.shipping,
				(error, result) => {
					if (error || !(result && result.id)) {
						error = (Types.isType(error, Types.STRING) && error) || (error && JSON.stringify(error) || "Unknown error.");
						return response.status(400).json(
							Server.LAYOUTS.ERROR(400, error)
						);
					}

					const payload = Server.LAYOUTS.SUCCESS(`Order set with success.`);
					payload.data = result;
					return response.status(200).json(payload);
				}
			);
		}
	);

	this.server.setRoute(Server.METHODS.POST, "/insert-item",
		(request, response) => {
			const body = request.body;

			if (!Types.isValid(body)) {
				return response.status(400).json(Server.LAYOUTS.ERROR(400, "Missing body."));
			}

			const fields = ["order", "sku", "price", "amount", "description"];
			if (!Types.isComplete(body, fields)) {
				return response.status(400).json(
					Server.LAYOUTS.ERROR(400, `Body should contain: ${fields.join(", ")}.`)
				);
			}

			return this.actuator.execute("manager-insert-item",
				body.order, body.sku, body.price, body.amount, body.description,
				(error, result) => {
					if (error || !(result && result.id)) {
						error = (Types.isType(error, Types.STRING) && error) || (error && JSON.stringify(error) || "Unknown error.");
						return response.status(400).json(
							Server.LAYOUTS.ERROR(400, error)
						);
					}

					const payload = Server.LAYOUTS.SUCCESS(`Item set with success.`);
					payload.data = result;
					return response.status(200).json(payload);
				}
			);
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