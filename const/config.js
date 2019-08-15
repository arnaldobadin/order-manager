module.exports = {
	interface : {
		port : 7777
	},
	context : {
		host : "localhost",
		user : "eletric-chicken",
		password : "webarelyremember",
		database : "storage",
		schema : __dirname + "/schema.sql"
	}
};

/*
	-- Instructions for add a new user into Mysql Database --
	UNINSTALL PLUGIN validate_password;
	CREATE USER 'eletric-chicken'@'localhost' IDENTIFIED BY 'webarelyremember';
	GRANT ALL PRIVILEGES ON * . * TO 'eletric-chicken'@'localhost';
	FLUSH PRIVILEGES;
*/