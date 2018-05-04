var mysql = require('mysql');
var connection = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
	host     : '192.168.1.100',
	port     : '6603',
	user     : 'jamie',
	password : 'poop',
	database : 'BioCloud',
});

module.exports = connection;