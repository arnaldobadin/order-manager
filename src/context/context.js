const config = require("../../const/config.js");

const Mysql = require("../../lib/mysql.js");
const Sync = require("../../lib/sync.js");
const Types = require("../../lib/types.js");

const Context = function() {
	this.mysql = new Mysql(
		config.context.host, config.context.user, config.context.password
	);

	this.status = false;
}

Context.prototype.start = async function() {
	if (this.status) return false;
	this.status = true;

	let status = null;
	status = await Sync.wait(this.mysql.schema, this.mysql, config.context.schema);
	status = await Sync.wait(this.mysql.open, this.mysql, config.context.database);

	if (status.error || !(status.result)) {
		return false;
	}

	return true;
}

Context.prototype.stop = async function() {
	if (!this.status) return false;
	this.status = false;

	this.mysql.close();
	return true;
}

Context.TABLES = {ORDER : "order", ITEM : "item"};

Context.prototype.insertOrder = function(name, contact, pid, shipping, callback) {
	callback = callback || (() => {});

	if (!Types.isValid(name)) return callback("Missing or invalid name.", null);
	if (!Types.isValid(contact)) return callback("Missing or invalid contact.", null);
	if (!Types.isValid(pid)) return callback("Missing or invalid pid.", null);
	if (!Types.isType(shipping, Types.NUMBER)) return callback("Missing or invalid shipping.", null);

	const query = `
		INSERT INTO \`${Context.TABLES.ORDER}\` (\`name\`, \`contact\`, \`pid\`, \`shipping\`)
		VALUES ('${name}', '${contact}', '${pid}', ${shipping});
		SELECT LAST_INSERT_ID() AS id;
	`;

	return this.mysql.query(query, 
		(error, result) => {
			let id = null;
			if (error || !(result && result.length && result[1] && result[1][0] && (id = result[1][0].id))) {
				return callback(error || "Empty set or unknown error.", null);
			}
			return callback(null, id);
		}
	);
}

Context.prototype.insertItem = function(order, sku, price, amount = 1, description, callback) {
	callback = callback || (() => {});

	if (!Types.isInteger(order)) return callback("Missing or invalid order.", null);
	if (!Types.isValid(sku)) return callback("Missing or invalid sku.", null);
	if (!Types.isType(price, Types.NUMBER)) return callback("Missing or invalid price.", null);
	if (!Types.isInteger(amount)) return callback("Missing or invalid amount.", null);
	if (!Types.isValid(description)) return callback("Missing or invalid description.", null);

	const query = `
		INSERT INTO \`${Context.TABLES.ITEM}\` (\`order\`, \`sku\`, \`price\`, \`amount\`, \`description\`)
		VALUES (${order}, '${sku}', ${price}, ${amount}, '${description}');
		SELECT LAST_INSERT_ID() AS id;
	`;

	return this.mysql.query(query, 
		(error, result) => {
			let id = null;
			if (error || !(result && result.length && result[1] && result[1][0] && (id = result[1][0].id))) {
				return callback(error || "Empty set or unknown error.", null);
			}
			return callback(null, id);
		}
	);
}

module.exports = Context;