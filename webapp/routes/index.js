var express = require('express');
var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var stringify = require('json-stringify-safe');
var router = express.Router();

// -- remove after done testing --
// currently used to feed false data until database is built
const testJSON = require('../testJSON');

router.get('/', function(req, res, next){
  res.render('index', {
    title: 'Home',
    jobs: testJSON.jobs,
    files: testJSON.files,
  });
});

router.post('/upload', function(req, res, next){
  console.log('entry');
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if(err){
      console.log(err);
      res.send('Error uploading file')
    } else {
      var x = JSON.parse(stringify(files));
      console.log(x.file.path);
	    // send file to user's directory within the gluster
      fs.createReadStream(x.file.path).pipe(fs.createWriteStream(`data/test/${x.file.name}`));
      res.send(util.inspect({fields: fields, files: files}));

      // create new file entry in database
    }
  });
});

module.exports = router;