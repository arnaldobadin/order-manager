module.exports = {
	interface : {
		port : 7777
	},
	context : {
		host : "localhost",
		user : "eletric-chicken",
		password : "webarelyremember",
		schema : __dirname + "/schema.sql"
	}
};