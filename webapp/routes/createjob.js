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

module.exports = router;