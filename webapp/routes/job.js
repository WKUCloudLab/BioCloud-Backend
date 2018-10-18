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
  res.render('job', {
    title: 'Job',
    job: req.app.get('selected-job'),
    isLoggedIn: true,
  });
});

module.exports = router;