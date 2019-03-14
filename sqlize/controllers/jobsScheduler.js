let waitQueue = [];
let readyQueue = [];
let inProcessQueue = [];
let childProcesses = {};
let jobCompletionSubProcess = [];
const fs = require('fs');
const jobsModel = require("../models").Jobs;
const filesModel = require("../models").Files;
const db = require('../models/index').db;

module.exports = {

  /*
  INTERVAL FUNCTIONS:
    pushToReady
    pushToInProcess
  */

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
                        continue;
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

        // TODO readydequeue
      }
    }
  }
};
