const express = require('express');
const formidable = require('formidable');
const http = require('http');
const util = require('util');
const fs = require('fs');
const stringify = require('json-stringify-safe');
const router = express.Router();
const time_stamp = require('log-timestamp');


router.get('/', function(req, res, next){
	var DB_USER = process.env.DB_USER;
	var DB_PASS = process.env.DB_PASS;

	// -- remove after done testing --
	// currently used to feed false data until database is built
	const testJSON = require('../testJSON');

	// req.session.username = 'ChAN MAN'
		var mysql = require('mysql');
		var connection = mysql.createConnection({
			host     : '192.168.1.100',
			port: '6603',
			user     : 'jamie',
			password : 'poop',
			database : 'BioCloud',
		});

	connection.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
	});

	var jobs = [];
	var files = [];

	var sql = "SELECT * FROM jobs";
	connection.query(sql, function (err, result) {
		if (err) throw err;
		jobs = result;
		console.log("Retreived Jobs");
		console.log("Jobs: "+ JSON.stringify(jobs));

		var sql = "SELECT * FROM files";
		connection.query(sql, function (err, result) {
			if (err) throw err;
			files = result;
			console.log("Retreived Files");
			console.log("Files: "+ JSON.stringify(files));

			connection.end();

			res.render('index', {
				title: 'Home',
				jobs: jobs,
				files: files,
			});
		});
	});

	/*
	for(var x = 0; x < jobs.length; x++){
		jobs[x].start = jobs[x].start.format('MM/DD/YYYY');
		jobs[x].end = jobs[x].start.format('MM/DD/YYYY');
	}
	*/
});

router.post('/upload', function(req, res, next){
  console.log('entry');
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if(err){
      console.log(err);
      res.send('Error uploading file')
		} 
		else 
		{
      var x = JSON.parse(stringify(files));
      console.log(x.file.path);
	    // send file to user's directory within the gluster
			fs.createReadStream(x.file.path).pipe(fs.createWriteStream("/data/demoDir/"+x.file.name));
			//fs.writeFile("/data/demoDir", x.file);
      res.send(util.inspect({fields: fields, files: files}));

      // create new file entry in database
			var DB_USER = process.env.DB_USER;
			var DB_PASS = process.env.DB_PASS;

			// req.session.username = 'ChAN MAN'
			var mysql = require('mysql');
			var connection = mysql.createConnection({
				host     : '192.168.1.100',
				port: '6603',
				user     : 'jamie',
				password : 'poop',
				database : 'BioCloud',
			});

			connection.connect(function(err) {
				if (err) throw err;
				console.log("Connected!");
			});

			var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
			var sql = "INSERT INTO files (user_id, job_id, name, size, created, path, filetype, locked)" +
				" VALUES ('0000', '0000', '"+x.file.name+"', '"+x.file.size+"', '"+d+"', '"+'/data/demoDir/'+x.file.name+"', 'Unknown', '"+'UNLOCKED'+"')";
			console.log(sql);
			connection.query(sql, function (err, result) {
					if (err) throw err;
				console.log("Successful!");
				});

			connection.end();
    }
  });
});

module.exports = router;
