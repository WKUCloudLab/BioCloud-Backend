const express = require('express');
const router = express.Router();
const loadjson = require('load-json-file');
const writejson = require('write-json-file');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const spawn = require('child_process').spawn;
// Remove after done testing
const testJSON = require('../testJSON');
const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');

router.get('/', (req, res) => {
  // create new job entry in database
  const DB_USER = process.env.DB_USER;
  const DB_PASS = process.env.DB_PASS;

  var  mysql = require('mysql');
  // req.session.username = 'ChAN MAN'
  const connection = mysql.createConnection({
    host: '192.168.1.100',
    port: '6603',
    user: 'jamie',
    password: 'poop',
    database: 'BioCloud',
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

  let files = [];
  const sql = 'SELECT * FROM files';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    files = result;
    console.log('Retreived Files');
    // console.log("Files: "+ JSON.stringify(files));

    connection.end();

    res.render('createjob', {
      title: 'Create Job',
      script: testJSON.scripts[0],
      files,
    });
  });
});

router.post('/sendjob', (req, res) => {
  console.log('entry');
  console.log(req.body);

  // create new job entry in database
  	const DB_USER = process.env.DB_USER;
  	const DB_PASS = process.env.DB_PASS;
	console.log("connect to DB "+ DB_USER);
	var mysql = require('mysql');
  	// req.session.username = 'ChAN MAN'
  var connection = mysql.createConnection({
    		host: 'localhost',
    		port: '6603',
    		user: 'jamie',
    		password: 'poop',
    		database: 'BioCloud',
  	});
  	console.log('create mysql connection');
        connection.connect((err) => {
    		if (err) throw err;
    		console.log('Connected!');
  	});

  var sql = 'SELECT id FROM jobs ORDER BY id DESC LIMIT 1;';
  var id;
  console.log('submitting query');
  const finished = new Promise(((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
        throw err;
      }
      console.log(`largest id${  result[0].id}`);
      resolve(parseInt(result[0].id));
      id = parseInt(result[0].id);
      if (isNaN(id))
      { console.log('id is NaN');}
     connection.end();
    });
  }));

  finished.then((result) => {
    // need to indent here

    id = result;
    console.log('query submitted');
    id++;
    console.log(`id ${  id}`);
  	const scriptName = req.body.script;
  	const fileName = req.body.file;
    console.log(scriptName);
    console.log(fileName);

    // need to make sure this name matches existing script
    const demo_directory = '/data/demoDir';
    const bash = `#!/bin/bash\n\n${  scriptName  } ${  demo_directory  }/${  fileName}`;
    console.log('creating bash string');
    // save this to file system
    fs.writeFile(`${demo_directory}/test.sh`, bash, (err) => {
      if (err) throw err;
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
  		console.log(e);
    }
    jsonloaded.then((result) => {
	   let kube_command = `${demo_directory}/test.sh`;
	   console.log(doc);
      doc.metadata.name = scriptName + id + 1;
	   console.log('11111');
      doc.spec.template.spec.containers[0].name = scriptName;
	   console.log('2222');
      doc.spec.template.spec.containers[0].image = 'chanstag/' + scriptName;
	   console.log('33333');
      doc.spec.template.spec.containers[0].command = ['bash', '-c', '' + kube_command + ''];
	   console.log('44444');
      doc.spec.template.spec.containers[0].volumeMounts[0].mountPath = '/data';
	   console.log('66666');
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
			/*(err, stdout, stderr) =>{
              		if (err) {
                 		console.error(err);
                 		return;
               		}
               		console.log(stdout);
            	})*/
      });
    });
   

  console.log(`Script :${scriptName}`);
  console.log(`File :${fileName}`);
  // create new job entry in database

  // req.session.username = 'ChAN MAN'
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: '192.168.1.100',
    port: '6603',
    user: 'jamie',
    password: 'poop',
    database: 'BioCloud',
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var sql = 'INSERT INTO jobs (name, status, start, end, next_job, script_id, user_id, pipeline_id, commands)' +
				" VALUES ('"+req.body.script+"', 'INPROCESS', '"+date+"', '"+date+"', '1', 'FastQC', '0000', '1', '1')";
  console.log(sql);
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Successful!');
  });

  connection.end();
}, (err) => {
    console.log(err);
 });
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

