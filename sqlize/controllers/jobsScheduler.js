let waitQueue = [];
let readyQueue = [];
let inprocessQueue = [];
let childProcesses = {};
let jobCompletionSubProcess = [];
const fs = require('fs');
const jobsModel = require("../models").Jobs;
const filesModel = require("../models").Files;
const db = require('../models/index').db;

module.exports = {
  waitEnqueue(job) {
    return new Promise((resolve, reject) => {
      // Wait enqueue
      let id = job.message[0].dataValues.id;
      let originalLength = waitQueue.length;
      let newLength = waitQueue.unshift(job);
      if (newLength <= originalLength) {
        reject(new Error("Can't add to wait queue"));
      } else {
        job.update({ status: "ENQUEUE" }, { fields: ["status"] }).then(job => {
          resolve(job);
        });
      }
    });
  },

  pushToReady() {
      if (waitQueue.length > 0){
          waitQueue.forEach(job => {
            Files.findAll({ where: {jobId: job.message[0].dataValues.id}})
            .then(files => {
                files.forEach(file => {
                    if(file.path === null){
                        continue;
                    }

                    fs.access(file.path + file.name, err => {
                        if(err){
                            console.log(err)
                        }
                        // TODO ready enqueue
                        // TODO waitDequeue
                    })
                });
                // Perform filesystem check here for user files if not present in database
                if (files.length === 0) {
                    db.sequelize.query("SELECT Options, Users.username FROM Jobs, Users WHERE Jobs.id=? AND Jobs.userId = Users.id", 
                    {replacements: [job.message[0].dataValues.id], type: sequelize.QueryTypes.SELECT})
                    .then(options => {
                        options.forEach(option => {
                            let args = option.options.split(" ");
                            let path = "/data/users/"+option.username+"/"+args[1]
                            fs.access(path, fs.constants.F_OK | fs.constants.R_OK, (err)=>{
                                if (err){
                                    console.log("File does not exist", err);
                                    return;
                                }
                                //TODO ready enqueue
                                //TODO wait dequeue
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
  }
};
