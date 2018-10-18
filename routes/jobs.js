const express = require('express');
const router = express.Router();
const yaml = require('yaml');
const fs = require('fs');
const { exec } = require('child_process');


router.post('/', function(req, res, next){
    if((req.session && req.session.username)){
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
        
    }
	else{
		res.redirect('/login');
    }
    

});