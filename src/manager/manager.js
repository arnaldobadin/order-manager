const Sync = require("../../lib/sync.js");
const Types = require("../../lib/types.js");

const Tool = require("./tool.js");

const Manager = function(actuator, context) {
	this.actuator = actuator;
	this.context = context;

	this.status = false;

	this.setup();
}

Manager.prototype.setup = function() {
	this.actuator.set("manager-get-order", (...params) => {return this.getOrder(...params);});
	this.actuator.set("manager-insert-order", (...params) => {return this.insertOrder(...params);});
	this.actuator.set("manager-insert-item", (...params) => {return this.insertItem(...params);});
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
	if (!Types.isType(name, Types.STRING)) return callback("Missing or invalid name.", null);
	if (!Types.isType(contact, Types.STRING)) return callback("Missing or invalid contact.", null);
	if (!Types.isType(pid, Types.STRING)) return callback("Missing or invalid pid.", null);
	if (!Types.isType(shipping, Types.NUMBER)) return callback("Missing or invalid shipping.", null);

	if (!Tool.checkContact(contact)) {
		return callback("Invalid contact (must be email or phone).");
	}

	if (!Tool.checkPid(pid)) {
		return callback("Invalid pid (must be cpf or cnpj).");
	}

	return this.context.insertOrder(
		name, contact, pid, shipping,
		(error, result) => {
			if (error) return callback(error, null);
			return callback(null, {id : result});
		}
	);
}

Manager.prototype.insertItem = function(order, sku, price, amount = 1, description, callback) {
	if (!Types.isInteger(order)) return callback("Missing or invalid order.", null);
	if (!Types.isType(sku, Types.STRING)) return callback("Missing or invalid sku.", null);
	if (!(Types.isType(price, Types.NUMBER) && price > 0)) return callback("Missing or invalid price.", null);
	if (!(Types.isInteger(amount) && amount > 0)) return callback("Missing or invalid amount.", null);
	if (!Types.isType(description, Types.STRING)) return callback("Missing or invalid description.", null);

	return this.context.insertItem(
		order, sku, price, amount, description,
		(error, result) => {
			if (error) return callback(error, null);
			return callback(null, {id : result});
		}
	);
}

Manager.prototype.getOrder = async function(id, callback) {
	if (!Types.isInteger(id)) return callback("Missing or invalid id.", null);

	let status = null;
	
	status = await Sync.wait(this.context.getOrder, this.context, id);
	if (status.error || !(status.result && status.result.length)) {
		return callback(status.error || "Can't find order.", null);
	}

	const order = status.result[0];

	status = await Sync.wait(this.context.getItemsByOrder, this.context, id);
	if (status.error) {
		return callback(status.error, null);
	}

	const items = status.result;

	if (items && items.length) {
		let weight = 0;

		for (let k in items) {
			weight += (items[k].price * items[k].amount)
		}

		const portion = order.shipping / weight;

		for (let k in items) {
			let item = items[k];
			items[k].quota = (portion * item.price * item.amount).toFixed(2) * 1;
		}
	}

	order.items = ((items && items.length) && items) || [];

	return callback(null, order);
}

module.exports = Manager;
