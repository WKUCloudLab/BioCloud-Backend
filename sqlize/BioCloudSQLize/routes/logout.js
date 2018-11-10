var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    req.logout();
    res.redirect('/login'); //Can fire before session is destroyed
  });

  module.exports = router;