var express = require('express');
var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var stringify = require('json-stringify-safe');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if((req.session && req.session.username))
		res.render('users', {user: req.session.username});
	else{
		res.redirect('/login');
	}
  // res.send('respond with a resource');
});

router.post('/upload', function(req, res, next){
  console.log('entry');
  if((req.session && req.session.username)){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
       if(err){
         console.log(err);
         res.send('Error uploading file')
       }
       else{
         var x = JSON.parse(stringify(files));
        console.log(x.file.path);
	//send file to user's directory within the gluster
        fs.createReadStream(x.file.path).pipe(fs.createWriteStream(`data/${reg.session.username}/${x.file.name}`));
        res.send(util.inspect({fields: fields, files: files}));
       }
    });

  }
  else{
    message = "you cannot upload, you're not logged in";
    res.redirect('/login')
    
  }
});

module.exports = router;
