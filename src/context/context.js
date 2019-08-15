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

	await Sync.wait(this.mysql.schema, this.mysql, config.context.schema);

	this.mysql.open(config.context.database);
	return true;
}

Context.prototype.stop = async function() {
	if (!this.status) return false;
	this.status = false;

	this.mysql.close();
	return true;
}

Context.TABLES = {ORDER : "order", ITEM : "item"};

module.exports = Context;