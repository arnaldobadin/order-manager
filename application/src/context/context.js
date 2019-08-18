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

Context.prototype.getOrder = function(id, callback) {
	callback = callback || (() => {});

	if (!Types.isInteger(id)) return callback("Missing or invalid id.", null);

	const query = `
		SELECT * FROM \`${Context.TABLES.ORDER}\` WHERE \`id\` = ${id};
	`;
	return this.mysql.query(query, callback);
}

Context.prototype.getItem = function(id, callback) {
	callback = callback || (() => {});

	if (!Types.isInteger(id)) return callback("Missing or invalid id.", null);

	const query = `
		SELECT * FROM \`${Context.TABLES.ITEM}\` WHERE \`id\` = ${id};
	`;
	return this.mysql.query(query, callback);
}

Context.prototype.getItemsByOrder = function(order, callback) {
	callback = callback || (() => {});

	if (!Types.isInteger(order)) return callback("Missing or invalid order.", null);

	const query = `
		SELECT * FROM \`${Context.TABLES.ITEM}\` WHERE \`order\` = ${order};
	`;
	return this.mysql.query(query, callback);
}

Context.prototype.insertOrder = function(name, contact, pid, shipping, callback) {
	callback = callback || (() => {});

	if (!Types.isType(name, Types.STRING)) return callback("Missing or invalid name.", null);
	if (!Types.isType(contact, Types.STRING)) return callback("Missing or invalid contact.", null);
	if (!Types.isType(pid, Types.STRING)) return callback("Missing or invalid pid.", null);
	if (!Types.isType(shipping, Types.NUMBER)) return callback("Missing or invalid shipping.", null);

	const query = `
		INSERT INTO \`${Context.TABLES.ORDER}\` (\`name\`, \`contact\`, \`pid\`, \`shipping\`)
		VALUES ('${name}', '${contact}', '${pid}', ${shipping})
		ON DUPLICATE KEY UPDATE
			\`name\` = '${name}',
			\`contact\` = '${contact}',
			\`pid\` = '${pid}',
			\`shipping\` = ${shipping};
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
	if (!Types.isType(sku, Types.STRING)) return callback("Missing or invalid sku.", null);
	if (!Types.isType(price, Types.NUMBER)) return callback("Missing or invalid price.", null);
	if (!Types.isInteger(amount)) return callback("Missing or invalid amount.", null);
	if (!Types.isType(description, Types.STRING)) return callback("Missing or invalid description.", null);

	const query = `
		INSERT INTO \`${Context.TABLES.ITEM}\` (\`order\`, \`sku\`, \`price\`, \`amount\`, \`description\`)
		VALUES (${order}, '${sku}', ${price}, ${amount}, '${description}')
		ON DUPLICATE KEY UPDATE
			\`price\` = ${price},
			\`amount\` = \`amount\` + ${amount},
			\`description\` = '${description}';
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

Context.prototype.deleteOrder = function(id, callback) {
	callback = callback || (() => {});

	if (!Types.isInteger(id)) return callback("Missing or invalid id.", null);

	const query = `
		DELETE FROM \`${Context.TABLES.ITEM}\` WHERE \`order\` = ${id};
		DELETE FROM \`${Context.TABLES.ORDER}\` WHERE \`id\` = ${id};
	`;

	return this.mysql.query(query, callback);
}

Context.prototype.deleteItem = function(id, callback) {
	callback = callback || (() => {});

	if (!Types.isInteger(id)) return callback("Missing or invalid id.", null);

	const query = `
		DELETE FROM \`${Context.TABLES.ITEM}\` WHERE \`id\` = ${id};
	`;

	return this.mysql.query(query, callback);
}

module.exports = Context;