module.exports = {
	interface : {
		port : 7777
	},
	context : {
		host : "localhost",
		user : "root",
		password : "webarelyremember",
		schema : __dirname + "schema.sql"
	}
};