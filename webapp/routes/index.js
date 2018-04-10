var express = require('express');
var router = express.Router();

var tools = require('../tools');

// Remove after done testing
const testJSON = require('../testJSON');

router.get('/', function(req, res){

  res.render('index', {
    title: 'Home',
    jobs: testJSON.jobs,
    files: testJSON.files,
    tools: tools,
  });
});

router.get('/createjob', function(req, res){
  res.render('createjob', {
    title: 'Create Job',
    script: testJSON.scripts[0],
    tools: tools,
  });
});

module.exports = router;