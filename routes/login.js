var express = require('express');
var fs = require('fs');
var stringify = require('json-stringify-safe');
var router = express.Router();

var DB_USER = process.env.DB_USER;
var DB_PASS = process.env.DB_PASS;

router.get('/', function (req, res){
	//this means they are logged in 
	if (req.session.username){
		res.redirect('/users');
	}else{
		content = 'You are not Logged in. Please Use the login Form Below';
		res.render('login', { title: 'Welcome to BioCloud', message: 'Hello there!' + content});
	}
	
	// make connection to 	
});

router.post('/', function(req, res){
	//check here if they are logged in already
	if(req.session && req.session.user){
        // res.send('already logged in')
		res.redirect('/users');
		// res.send('already logged in');
	}

	// req.session.username = 'ChAN MAN'
	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : DB_USER,
	  password : DB_PASS,
	  database : 'Biocloud'
	});

	connection.connect();

	console.log("user" + DB_USER);	
	console.log(DB_PASS);	
	fs.writeFile("./req.txt", stringify(req.body) , 'utf-8', function(err) {
	    if(err) {
		return console.log(err);
	    }

	    console.log("The file was saved!");
	});
	connection.query('SELECT * FROM users WHERE username=? && password=?', [req.body.user, req.body.pass], function (err, rows, fields ) {
	  if (err) throw err;
	  console.log(rows);
	  //console.log(fields);
	  //on success, perform the following
	  if(rows){
	  	console.log("User"+req.body.user+"logged in");
	  	req.session.username = req.body.user;
		res.render('users', {user: req.body.user});
	  }
	})

	connection.end();
	

});
module.exports = router;