var express = require('express');
var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var stringify = require('json-stringify-safe');
var router = express.Router();
var spawn = require('child_process').spawn;

// Redirects if users isn't logged in
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', isAuthenticated, function(req, res, next){
  var DB_USER = process.env.DB_USER;
	var DB_PASS = process.env.DB_PASS;

	// req.session.username = 'ChAN MAN'
	var connection = require('../lib/dbconn');

	var jobs = [];
	var files = [];

	var sql = "SELECT * FROM jobs WHERE user_id = '"+req.session.userId+"'";
	connection.query(sql, function (err, result) {
		if (err) throw err;
		jobs = result;
		console.log("Retreived Jobs");
		console.log("Jobs: "+ JSON.stringify(jobs));

		var sql = "SELECT * FROM files  WHERE user_id = '"+req.session.userId+"'";
		connection.query(sql, function (err, result) {
			if (err) throw err;
			files = result;
			console.log("Retreived Files");
			console.log("Files: "+ JSON.stringify(files));

			for(var x = 0; x < jobs.length; x++) {
				jobs[x].fileList = [];
				for(var y = 0; y < files.length; y++) {
					if(jobs[x].name == files[y].job_id) {
						jobs[x].fileList.push(files[y].name);
					}
				}
				console.log(jobs[x].fileList);
			}

			/*
				============================= For Testing ============================
			*/

			/*

			var current = new Date();
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var days = current.getDate();
			var th = "th";
			var hour = current.getHours();
			var AMPM = 'AM';
			var minute = current.getMinutes();
			console.log(th);
			if(days === 1 || days === 21) {
				th = "st";
			} else if(days === 2 || days === 22) {
				th = "nd";
			} else if(days === 3 || days === 23) {
				th = "rd";
			}
			if(hour > 13) {
				hour -= 12;
				AMPM = 'PM';
			}
			if(minute < 10) {
				minute = "0"+minute;
			}
			const date = months[current.getMonth()]+" "+days+th+" at "+hour+":"+minute+AMPM;
			console.log(date);

			// Job for jpg

			var sql = 'INSERT INTO jobs (id, name, status, start, end, next_job, script_id, user_id, pipeline_id, commands)' +
					" VALUES ('1', '1', 'INIT', '"+date+"', NULL, NULL, 'FastQC', 'jamie', NULL, 'FAKE NEWS')";
					
			connection.query(sql, (err, result) => {
				if (err) {
					console.log(err);
				}
				console.log('Successful!');
				//res.redirect('/'); 
			});

			var sql = "INSERT INTO files (user_id, job_id, name, size, created, path, filetype, locked, from_job)" +
				" VALUES ('jamie', '1', 'pic.jpg', '1000', '"+date+"', '/data/users/jamie/pic.jpg', 'jpg', 'UNLOCKED', '1')";

			connection.query(sql, function (err, result) {
				if (err){ 
					console.log(err);
					//res.end("Failure to retreive data from database: "+err);
				}
				console.log("Successful!");
			});

			// Job for txt

			var sql = 'INSERT INTO jobs (id, name, status, start, end, next_job, script_id, user_id, pipeline_id, commands)' +
					" VALUES ('2', '2', 'INIT', '"+date+"', NULL, NULL, 'FastQC', 'jamie', NULL, 'FAKE NEWS')";
					
			connection.query(sql, (err, result) => {
				if (err) {
					console.log(err);
				}
				console.log('Successful!');
				//res.redirect('/'); 
			});

			var sql = "INSERT INTO files (user_id, job_id, name, size, created, path, filetype, locked, from_job)" +
				" VALUES ('jamie', '1', 'test.txt', '1000', '"+date+"', '/data/users/jamie/text.txt', 'txt', 'UNLOCKED', '1')";

			connection.query(sql, function (err, result) {
				if (err){ 
					console.log(err);
					//res.end("Failure to retreive data from database: "+err);
				}
				console.log("Successful!");
			});

			// Job for html

			var sql = 'INSERT INTO jobs (id, name, status, start, end, next_job, script_id, user_id, pipeline_id, commands)' +
					" VALUES ('2', '2', 'INIT', '"+date+"', NULL, NULL, 'FastQC', 'jamie', NULL, 'FAKE NEWS')";
					
			connection.query(sql, (err, result) => {
				if (err) {
					console.log(err);
				}
				console.log('Successful!');
				//res.redirect('/'); 
			});

			var sql = "INSERT INTO files (user_id, job_id, name, size, created, path, filetype, locked, from_job)" +
				" VALUES ('jamie', '2', 'test.html', '1000', '"+date+"', '/data/users/jamie/test.html', 'html', 'UNLOCKED', '2')";

			connection.query(sql, function (err, result) {
				if (err){ 
					console.log(err);
					//res.end("Failure to retreive data from database: "+err);
				}
				console.log("Successful!");
			});

			*/

			/*
				============================ For Testing ============================
			*/

      res.render('homepage', {
				title: 'Home',
				username: req.session.userId,
        jobs: jobs,
        files: files,
        isLoggedIn: true,
			});
		});
	});
});

router.post('/upload', isAuthenticated, function(req, res, next){
  console.log('entry');
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if(err){
      console.log(err);
      res.send('Error uploading file: '+err);
		} else {
			var x = JSON.parse(stringify(files));
			var setFilePath = "/data/users/"+req.session.userId+"/"+x.file.name;
      console.log(x.file.path);
	    // send file to user's directory within the gluster
			fs.createReadStream(x.file.path).pipe(fs.createWriteStream(setFilePath, {mode: 0o777}));
			res.send(util.inspect({fields: fields, files: files}));
			
      // create new file entry in database
			var DB_USER = process.env.DB_USER;
			var DB_PASS = process.env.DB_PASS;

			var mysql = require('mysql');
			var connection = require('../lib/dbconn');

			var current = new Date();
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var days = current.getDate();
			var th = "th";
			var hour = current.getHours();
			var AMPM = 'AM';
			var minute = current.getMinutes();
			console.log(th);
			if(days === 1 || days === 21) {
				th = "st";
			} else if(days === 2 || days === 22) {
				th = "nd";
			} else if(days === 3 || days === 23) {
				th = "rd";
			}
			if(hour > 13) {
				hour -= 12;
				AMPM = 'PM';
			}
			if(minute < 10) {
				minute = "0"+minute;
			}
			const date = months[current.getMonth()]+" "+days+th+" at "+hour+":"+minute+AMPM;
			console.log(date);

			var fileType = x.file.name.split('.').pop();

			console.log(fileType);

			var fileSize = x.file.size / 1000;

			var sql = "INSERT INTO files (user_id, job_id, name, size, created, path, filetype, locked, from_job)" +
				" VALUES ('"+req.session.userId+"', NULL, '"+x.file.name+"', '"+fileSize+"', '"+date+"', '"+setFilePath+"', '"+fileType+"', '"+'UNLOCKED'+"', NULL)";
			connection.query(sql, function (err, result) {
				if (err){ 
					console.log(err);
					res.end("Failure to retreive data from database: "+err);
				}
				console.log("Successful!");
			});
			
    }
  });
});

router.post('/selectJob', function(req, res){
  req.session.jobID = req.body.jobId;
  res.send(req.session.jobID);
});

module.exports = router;
