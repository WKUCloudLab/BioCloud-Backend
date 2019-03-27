let waitQueue = [];
let readyQueue = [];
let inProcessQueue = [];
let childProcesses = {};
let jobCompletionSubProcess = [];
let runningJobs = [];
const fs = require('fs');
const jsonfile = require('jsonfile')
const jobsModel = require("../models").Jobs;
const filesModel = require("../models").Files;
const db = require('../models/index').db;

// Kubernetes client
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
let client;
try {
  client = new Client({config: config.getInCluster()})
}
catch (err) {
  console.log(err)
}


module.exports = {

  /*
  INTERVAL FUNCTIONS:
    pushToReady
    pushToInProcess
    checkCompletion
  */

  loadSpec(){
    try {
      client.loadSpec()
      .then(() => {
        console.log("Client loaded")
      })
      .catch(err => {
        console.log("Client failed to load")
      })
    }
    catch(err) {
      console.log(err)
    }

  },

  waitEnqueue(jobs) {
    return new Promise((resolve, reject) => {
      let jobRequests = jobs.map(job => {
        return new Promise((resolve, reject) => {
            job.update({ status: "ENQUEUE" }, {fields: ["status"] })
            .then(job => {
              waitQueue.unshift(job);
              resolve(job);
            })
        })
      })
      Promise.all(jobRequests).then(jobRequests => {
        resolve(jobRequests);
      })
      .catch(err => {
        reject(err);
      })
    });
  },

  pushToReady() {
      if (waitQueue.length > 0){
          waitQueue.forEach(job => {
            Files.findAll({ where: {jobId: job.id}})
            .then(files => {
                files.forEach(file => {
                    if(file.path === null){
                        return;
                    }

                    fs.access(file.path + file.name, err => {
                        if(err){
                            console.log(err)
                        }
                        readyEnqueue(job);
                        waitQueue(job);
                    })
                });
                // Perform filesystem check here for user files if not present in database
                if (files.length === 0) {
                    db.sequelize.query("SELECT Options, Users.username FROM Jobs, Users WHERE Jobs.id=? AND Jobs.userId = Users.id", 
                    {replacements: [job.id], type: sequelize.QueryTypes.SELECT})
                    .then(options => {
                        options.forEach(option => {
                            let args = option.options.split(" ");
                            let path = "/data/users/"+option.username+"/"+args[1]
                            fs.access(path, fs.constants.F_OK | fs.constants.R_OK, (err)=>{
                                if (err){
                                    console.log("File does not exist", err);
                                    return;
                                }
                                readyEnqueue(job);
                                waitQueue(job);
                            })
                        });
                    })
                    .catch(err => console.log(err))
                }
            })
            .catch(err => {
                console.log(err);
            })
          });
      }
  },

  // Add to ready queue
  readyEnqueue(job){
    return new Promise((resolve, reject) => {
      readyQueue.unshift(job);
      resolve(job);
    })
  },

  // Remove from wait queue
  waitDequeue(job) {
    return new Promise((resolve, reject) => {
      if (waitQueue.length === 0){
        reject("Nothing to dequeue");
      }
      // Remove from wait queue
      waitQueue.splice(waitQueue.findIndex(waitJob => waitJob.id === job.id), 1);
      resolve();
    })
  },

  pushToInProcess() {
    if (inProcessQueue.length < 5){
      let jobsToPush = 5 - inProcessQueue.length;
      for (let index = 0; index < jobsToPush; index++) {
        if(readyQueue.length == 0){
          // Nothing to push
          return;
        }

        readyDequeue().then(job => {
          buildJson(job)
          .then(job => {

          })
        })
      }
    }
  },

  readyDequeue() {
    return new Promise((resolve, reject) => {
      try {
        let job = readyQueue.pop();
        resolve(job);
      }
      catch (err) {
        reject(err);
      }
    })
  },

  checkCompletion() {
    runningJobs.map((job, idx) => {
      client.apis.v1.namespaces('default').jobs(job.id).get()
      .then(jobResponse => {
        let status = jobResponse.status.conditions.type;
        if (status === "Complete"){
          runningJobs.splice(idx, 1);
          let completionTime = jobResponse.status.completionTime;
          job.update({ status: 'COMPLETE', end: completionTime })
          .then(() => {
            console.log(`Job ${job.id} completed`)
            // Destroy job
            client.apis.v1.namespaces('default').jobs(job.id).destroy()
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
    })
  },

  submitK8s(job) {
    buildJson(job)
    .then(job => {
      const jobManifest = require('./instance.json');
      client.apis.apps.v1.namespaces('default').jobs.post({ body: jobManifest })
      .then(() => {
        runningJobs.push(job);
      }).catch(err => {
        console.error("Failed to submit job", err);
      })
    })
  },

  buildJson(job){
    return new Promise((resolve, reject) => {
      db.sequelize.query("SELECT Jobs.id, Jobs.status, Jobs.scriptId, Users.username, Jobs.options FROM Jobs, Users WHERE Jobs.id=? AND Jobs.userId = Users.id", 
        {replacements: [job.id], type: sequelize.QueryTypes.SELECT})
        .then(results => {
          if (results.length === 0) {
            // Job doesn't exist
            return
          }
          let result = results[0];
          jsonfile.readFile('./template.json')
          .then(doc => {
            let command = result.options;
            let scriptName = result.scriptId.toLowerCase();
            let jobId = (Number.isNaN(result.id) ? parseInt(result.id) :  result.id);
            let kubeCommand = `/data/test.sh`;

            doc.metadata.name = jobId;
            doc.spec.template.metadata.labels = {"name": scriptName+jobId};
            doc.spec.template.spec.containers[0].name = scriptName;
            doc.spec.template.spec.containers[0].image = `chanstag/${scriptName}`
            doc.spec.template.spec.containers[0].command = ['bash', '-c', '' + kubeCommand + '']

            jsonfile.writeFile("./instance.json", doc)
            .then(() => {
              writeToScript(command).then(() => {
                resolve(job)
              }).catch(err => {
                console.log(err)
                reject(err)
              })
            })
            .catch(err => {
              console.log(err)
              reject(err)
            })
          })
          .catch(err => {
            console.log(err)
            reject(err);
          })
        })
    })
  },

  writeToScript(command){
    return new Promise((resolve, reject) => {
      let argList = "#!/bin/bash\n\n";

      let args = command.split(" ");
      argList+=`${args[0]} ${args[1]}\n`
      argList+=`ls /data\n`
      argList+=`echo "Successful Execution"`

      fs.writeFile(`/data/test.sh`, arglist, err => {
        if (err){
          console.log(err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }


};
