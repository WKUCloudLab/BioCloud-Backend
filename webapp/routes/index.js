var express = require('express');
var router = express.Router();

// Remove after done testing
const testJSON = require('testJSON');

router.get('/', function(req, res){

  res.render('index', {
    title: 'Home',
    jobs: testJSON.jobs,
    files: testJSON.files,
  });
});

router.get('/createjob/scripts', function(req, res){
	var scriptList = [];
	for(var x = 0; x < testJSON.scripts.length; x++) {
		scriptList.push(testJSON.scripts[x].name);
	}
  res.render('createjob/scripts', {
    title: 'Create Job',
    scriptsList: scriptList,
  });
});

router.get('/createjob/commands', function(req, res){
  res.render('createjob/commands', {
    title: 'Create Job',
    script: testJSON.scripts[0],
  });
});

module.exports = router;

