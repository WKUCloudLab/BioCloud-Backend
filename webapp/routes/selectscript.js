var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Remove after done testing
const scriptsFile = require('../public/js/scripts');

// Redirects if users isn't logged in
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', isAuthenticated, function(req, res){
  var scriptsList = [];
  for(var x = 0; x < scriptsFile.length; x++) {
    scriptsList.push({
      id: scriptsFile[x].id,
      name: scriptsFile[x].name,
      description: scriptsFile[x].description,
    });
  }

  res.render('selectscript', {
    title: 'Select Script',
    scripts: scriptsList,
    isLoggedIn: true,
  });
});

router.post('/select', function(req, res){
  req.session.selectedScript = req.body.script;
  res.send(req.session.selectedScript);
});

module.exports = router;