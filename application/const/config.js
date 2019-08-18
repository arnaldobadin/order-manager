const config = {
	interface : {
		port : parseInt(process.env.SERVER_PORT) || 7777
	},
	context : {
		host : process.env.MYSQL_HOST || "localhost",
		user : process.env.MYSQL_USER || "eletric-chicken",
		password : process.env.MYSQL_PASSWORD || "somethingdifferent",
		database : "storage",
		schema : __dirname + "/schema.sql"
	}
};

module.exports = config;