var express = require('express');
var router = express.Router();

// Remove after done testing
const testJSON = require('../testJSON');

router.get('/', function(req, res){
  res.render('createjob', {
    title: 'Create Job',
    script: testJSON.scripts[0],
  });
});

router.post('/sendJob', function(req, res, next){
  console.log('recieving job');

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if(err){
      console.log(err);
      res.send('Error starting job')
    } else {
	// call job to the backend


      	// create new job entry in database

    }
  });
});

module.exports = router;
