const express = require('express');
var app = express();
const router = express.Router();
const loadjson = require('load-json-file');
const writejson = require('write-json-file');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const spawn = require('child_process').spawn;
const  DB_USER = process.env.DB_USER;
const  DB_PASS = process.env.DB_PASS;

const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./err.log', 'a');

// Remove after done testing
const scripts = require('../public/js/scripts');

// Redirects if users isn't logged in
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

var flash = require('connect-flash');

router.get('/', isAuthenticated, function(req, res){
  if(!req.session.selectedScript) {res.send('No Script Selected')};
  
  var selectedScript = req.session.selectedScript;
  console.log(selectedScript);

  for(var x = 0; x < scripts.length; x++) {
    if(selectedScript == scripts[x].id) {
      selectedScript = scripts[x];
    }
  }

  //selectedScript = scripts[0];

  // create new job entry in database

  // req.session.username = 'ChAN MAN'
  var mysql = require('mysql');
  var connection = require('../lib/dbconn');

  var files = [];
  var sql = "SELECT * FROM files";
  connection.query(sql, function (err, result) {
      if (err) throw err;
    files = result;
    console.log("Retreived Files");
    console.log("Files: "+ JSON.stringify(files));
    
    scriptString = JSON.stringify(selectedScript);

    res.render('createjob', {
      title: 'Create Job',
      script: selectedScript,
      scriptString: scriptString,
      files: files,
      message: req.flash('message'),
    });
  });
});

router.post('/sendjob', function(req, res){
  console.log(req.session.userId);
  if(req.session.userId == undefined){
    console.log(req.session.userId);
    res.send('Cannot submit job without being logged in. Please log in.');
  }
  var scriptData = req.body;
  var DB_USER = process.env.DB_USER;
  var DB_PASS = process.env.DB_PASS;

  console.log('entry: ');
  console.log(scriptData['commands'][0]['args']);

  var commandLines = [];
  for(var x = 0; x < scriptData['commands'].length; x++) {
    var newLine = scriptData['script'];
    newLine += ' '+scriptData['define-output']+" /data/users/"+req.session.userId;
    if(
      scriptData['commands'][x]['command'] != null && 
      scriptData['commands'][x]['command'] != 'null' &&
      scriptData['commands'][x]['command'] != ''
    ){
      newLine += ' '+scriptData['commands'][x]['command'];
    }
    newLine += ' '+scriptData['file'];
    for(var y = 0; y < scriptData['commands'][x]['args'].length; y++) {
      // Write as true if is a true false variable
      if(
        scriptData['commands'][x]['args'][y]['value'] == true ||
        scriptData['commands'][x]['args'][y]['value'] == 'true'
      ) {  
        newLine += ' '+scriptData['commands'][x]['args'][y]['arg'];

      // Write with value if not true or false
      }else if(
        scriptData['commands'][x]['args'][y]['value'] != null && 
        scriptData['commands'][x]['args'][y]['value'] != '' &&
        scriptData['commands'][x]['args'][y]['value'] != false &&
        scriptData['commands'][x]['args'][y]['value'] != 'false' 
      ) {
        newLine += ' '+scriptData['commands'][x]['args'][y]['arg'];
        newLine += ' '+scriptData['commands'][x]['args'][y]['value'];
      }
    }
    commandLines.push(newLine);
  }

  console.log(`Command: ${commandLines[0]}`);

  /*
  // create new job entry in database
  var mysql = require('mysql');
  var connection = require('../lib/dbconn');
  var sql = 'SELECT id FROM jobs ORDER BY id DESC LIMIT 1;';
  var id;
  console.log('submitting query');
  const finished = new Promise(((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        throw err;
      }
      if(result.length == 0) {
        resolve(parseInt(0));
      } else {
        console.log(`largest id${  result[0].id}`);
        resolve(parseInt(result[0].id));
        id = parseInt(result[0].id);
        if (isNaN(id)) { 
          console.log('id is NaN');
        }
      }
    });
  }));

  finished.then((result) => {
    // need to indent here
    id = result;
    console.log('query submitted');
    id++;
    console.log(`id ${id}`);
    const scriptName = scriptData['script'];
    const fileName = scriptData['file'];
    console.log(scriptName);
    console.log(fileName);

    // need to make sure this name matches existing script
    const user_directory = '/data/users/'+req.session.userId;
    const bash = `#!/bin/bash\n\n${  scriptName  } ${  user_directory  }/${  fileName}`;
    console.log('creating bash string');
    // save this to file system
    fs.writeFile(`/data/${req.session.userId}test.sh`, bash, (err) => {
      if (err){
        console.log("Failed to write shell file: "+err);
        res.end();
      };
      // success case, the file was saved
      console.log('bash file saved!');
    });

    // create yaml file here and then pass that as an arg to the exec command
    let doc = {};
    try {
      console.log('loading json');
      var jsonloaded = loadjson('./template.json').then((json) => {
        doc = {};
        console.log(`json returned${  json}`);
        doc = json;
      });
  		console.log(`doc${  doc}`);
    } catch (e) {
		reject(e);
  		console.log(e);
    }

    jsonloaded.then((result) => {
      let kube_command = `/data/${req.session.userId}test.sh`;
      console.log(doc);
      doc.metadata.name = scriptName + id;
      doc.spec.template.metadata.labels = {"app":scriptName };
      doc.spec.template.spec.containers[0].name = scriptName;
      doc.spec.template.spec.containers[0].image = 'chanstag/' + scriptName;
      doc.spec.template.spec.containers[0].command = ['' + kube_command + ''];
      doc.spec.template.spec.containers[0].volumeMounts[0].mountPath = '/data';
      console.log(util.inspect(doc, false, 10, true));
      let promise;
      try {
        promise = writejson('template.json', doc).then(() => {
          console.log('done');
        });
      } catch (e) {
        console.log(e);
      }

      promise.then((result) => {
        console.log("executing");
        spawn("kubectl",  ["create","-f","./template.json"], {  detached: true, stdio: [ 'ignore', out, err ] });
        console.log("process spawned");
      });
    });
   
    console.log(`Script :${scriptName}`);
    console.log(`File :${fileName}`);
    
    // create new job entry in database
    var current = new Date();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = current.getDate();
    var th = "th";
    var hour = current.getHours();
    var AMPM = 'AM';
    var minute = current.getMinutes();
    if(days === 1 || days === 21) {
      th = "st";
    } else if(days === 2 || days === 22) {
      th = "nd";
    } else if(days === 3 || days === 23) {
      th = "rd";
    }
    if(hour > 13) {
      hour -= 12;
      AMPM = 'PM';
    }
    if(minute < 10) {
      minute = "0"+minute;
    }
    const date = months[current.getMonth()]+" "+days+th+" at "+hour+":"+minute+AMPM;

    var sql = 'INSERT INTO jobs (name, status, start, end, next_job, script_id, user_id, pipeline_id, commands)' +
          " VALUES ('"+scriptData['script']+"', 'INIT', '"+date+"', NULL, NULL, 'FastQC', '"+req.session.userId+"', NULL, '"+commandLines[0]+"')";
    console.log(sql);
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log('Successful!');
      res.redirect('/'); 
    });
  }, (err) => {
    console.log(err);
  });
  */
});      



module.exports = router;
