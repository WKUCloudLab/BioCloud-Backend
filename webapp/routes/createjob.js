var express = require('express');
var router = express.Router();

// Remove after done testing
const testJSON = require('../testJSON');

router.get('/', function(req, res){
  // create new job entry in database
  var DB_USER = process.env.DB_USER;
  var DB_PASS = process.env.DB_PASS;

  // req.session.username = 'ChAN MAN'
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host     : '192.168.1.100',
    port: '6603',
    user     : 'jamie',
    password : 'poop',
    database : 'BioCloud',
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  var files = [];
  var sql = "SELECT * FROM files";
  connection.query(sql, function (err, result) {
      if (err) throw err;
    files = result;
    console.log("Retreived Files");
    //console.log("Files: "+ JSON.stringify(files));

    connection.end();

    res.render('createjob', {
      title: 'Create Job',
      script: testJSON.scripts[0],
      files: files,
    });
  });
});

router.post('/sendjob', function(req, res){
  var scriptName = JSON.parse(req.body).script;
  var fileName = JSON.parse(req.body).file;

  console.log("Script :" + scriptName);
  console.log("File :" + fileName);

      // create new job entry in database
			var DB_USER = process.env.DB_USER;
			var DB_PASS = process.env.DB_PASS;

			// req.session.username = 'ChAN MAN'
			var mysql = require('mysql');
			var connection = mysql.createConnection({
				host     : '192.168.1.100',
				port: '6603',
				user     : 'jamie',
				password : 'poop',
				database : 'BioCloud',
			});

			connection.connect(function(err) {
				if (err) throw err;
				console.log("Connected!");
			});

			var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
			var sql = "INSERT INTO jobs (name, status, start, end, next_job, script_id, user_id, pipeline_id, commands)" +
				" VALUES ('Test Job', 'INPROCESS', '"+date+"', "+null+", "+null+", 'FastQC', '0000', null, null)";
			connection.query(sql, function (err, result) {
				if (err) throw err;
				console.log("Successful!");
			});

      connection.end();
      
      // call job to the backend
      
      /*

       //need to make sure this name matches existing script 
       var script = req.body.script;
       var arr = req.body.args
       var demo_directory = /data/demoDir;
       var bash = "#!/bin/bash\n\n"+script+" "+arr[0];
       //save this to file system
       fs.writeFile(demo_directory+"/test.sh", bash, (err) => { 
           if (err) throw err;
               // success case, the file was saved
               console.log('bash file saved!');
       });
       //create yaml file here and then pass that as an arg to the exec command
       yaml.load('template.yml', function(result)
       {   
           console.log(yaml.stringify(result, 4));
           nativeObject = result;
           nativeObject.metadata.name = script;
           nativeObject.metadata.spec.spec.containers.name = [script];
           nativeObject.metadata.spec.spec.containers.image = "chanstag/"+script;
           nativeObject.metadata.spec.spec.containers.command = arr;
           nativeObject.metadata.spec.spec.containers.restartPolicy = "Never"
           nativeObject.metadata.spec.spec.containers.volumeMounts = demo_directory;
           fs.writeFile("./template.yaml", nativeObject, (err) => { 
               if (err) throw err;
               
                   // success case, the file was saved
                   console.log('yaml file saved!');
   
           }).exec("kubectl create -f ./template.yaml", (err, stdout, stderr) => {
               if (err) {
                 console.error(err);
                 return;
               }
               console.log(stdout);
             });
      })
      */
});

module.exports = router;
