const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const YAML = require('yamljs');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

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
	console.log("entry");
	console.log(req.body);



  	var scriptName = req.body.script;
  	var fileName = req.body.file;
	console.log(scriptName);
	console.log(fileName);

       //need to make sure this name matches existing script 
       var demo_directory = "/data/demoDir";
       var bash = "#!/bin/bash\n\n"+scriptName+" "+fileName;
       console.log("creating bash string");
	//save this to file system
       fs.writeFile(demo_directory+"/test.sh", bash, (err) => { 
           if (err) throw err;
               // success case, the file was saved
               console.log('bash file saved!');
       });
       //create yaml file here and then pass that as an arg to the exec command
	try {
 	 	var doc = yaml.safeLoad(fs.readFileSync('template.yaml', 'utf8'));
  		console.log(doc);
	} catch (e) {
  		console.log(e);
	}
		var kube_command = demo_directory+"test.sh";
	   console.log(util.inspect(doc, false, 10, true));
           doc.metadata.name = scriptName;
	   console.log('11111');
           doc.spec.template.spec.containers[0].name = [scriptName];
	   console.log('2222');
           doc.spec.template.spec.containers[0].image = "chanstag/"+scriptName;
	   console.log('33333');
           doc.spec.template.spec.containers[0].command = [kube_command];
	   console.log('44444');
           doc.spec.template.spec.containers[0].restartPolicy = "Never"
	   console.log('55555');
           doc.spec.template.spec.containers[0].volumeMounts = demo_directory;
	   console.log('66666');
	   console.log(util.inspect(doc, false, 10, true));
	var output =	yaml.safeDump (doc, {
  		'styles': {
    		'!!null': 'canonical' // dump null as ~
  		},
  	'sortKeys': true        // sort object keys
	});
        fs.writeFile("./template.yaml", output, (err) => { 
               if (err) throw err;
               
                   // success case, the file was saved
                   console.log('yaml file saved!');
  

		exec("kubectl create -f ./template.yaml", (err, stdout, stderr) => {
              	 if (err) {
                 console.error(err);
                 return;
               	}
               console.log(stdout);
            });
        });
	
        console.log("Script :" + scriptName);
        console.log("File :" + fileName);	 
	
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
				" VALUES ('Test Job', 'INPROCESS', '"+date+"', '"+date+"', '1', 'FastQC', '0000', '1', '1')";
			console.log(sql);
			connection.query(sql, function (err, result) {
				if (err) throw err;
				console.log("Successful!");
			});

      connection.end();
});      
      // call job to the backend
      
      
/*	
       //need to make sure this name matches existing script 
       var script = req.body.script;
       var arr = req.body.args
       var demo_directory = "/data/demoDir";
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
     

module.exports = router;
