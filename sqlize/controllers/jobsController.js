const jobs_model = require('../models').Jobs;
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const usersController = require('./usersController');
const mom = require('moment');


module.exports.submitJob =   (jobs) => {
    return new Promise(async (res, rej)=>{
        if(!jobs){
            rej(Error({'status':false, 'messsage':"empty list of job objects"}));
        }
        console.log("jobs", jobs.jobsList[0]);
        let jobCreated;
        let jobsList = []
        for(i of jobs.jobsList){
            console.log(i);
            let jobToSubmit = {}
            jobToSubmit.name = i.name;
            jobToSubmit.scriptId = i.options.script.name;
            if(!i.username){
                jobToSubmit.userId = 'Jamie';
            }else{
                jobToSubmit.userId = i.username;
            }
            //will need to reconsider this, such as retrieving userID from table first
            jobToSubmit.userId = 1;

            jobToSubmit.options = i.entry;
            jobToSubmit.start = mom(i.created).format();
            jobToSubmit.status = 'INIT'
            console.log(jobToSubmit);
            jobCreated = await jobs_model.create(jobToSubmit);
            if(objIsEmpty(jobCreated)){
                res({'status':false, 'messsage':`did not create job ${i}`});
                return;
            }
            jobsList.push(jobCreated);
        }

        res({'status':true, 'message':jobsList});
        return;
    })
        
    };

    module.exports.jobGetInfo = (jobID) => {
        return new Promise(async (res, rej)=>{
            if(!jobID){
                rej(Error({'status':false, 'messsage':"no job ID provided"}));
                return;
            }
            let jobInfo = await jobs_model.findById(jobID);
    
            if(objIsEmpty(jobInfo)){
                res({'status':false, 'message':"job info was returned as empty from DB. Could not find job."});
                return;
            }
    
            res ({'status':true, 'message':jobInfo});
            return;
        })
        
    },

    module.exports.jobGetStatus = (job)=>{
        return new Promise(async (res, rej)=>{
            if(!job){
                rej(Error({'status':false, 'messsage':"no job object provided"}));
                return;
            }
            if(!job.id)
            {
                rej(Error({'status':false, 'messsage':"no job ID provided"}));
                return;
            }
            let jobID =  job.id;
            let jobStatus = {}
    
            try{
                 jobStatus = await  jobs_model.findOne({'where': {'id':jobID}, 'attributes':['status']})
            }
            catch(err){
                if(err){
                    rej(Error({'status':false, 'messsage':"ERROR_FINDING_JOB_BY_ID"}));
                    return;
                }
            }
            if(objIsEmpty(jobStatus) || objIsEmpty(jobStatus.dataValues)){
                res({'status':false, 'message':"job info was returned as empty from DB. Could not find job."})
                return;
            }
    
            res({'status': true, 'message': jobStatus.dataValues});
            return;
        });
       
    }

    module.exports.getJobsList = async (username)=>{
        return new Promise(async (res, rej)=>{
            if(!username){
                rej({'status':false, 'messsage':"NO_USERNAME_PROVIDED"});
                return;
            }
            //this will return an aobject that looks like {'status': [true or false], message:[failure message or userId]}
            let userId = await usersController.getUserIDByUsername(username);
           let jobsList = await jobs_model.findAll({'where': {'userId':userId.message}, 'attributes':['id', 'status', 'start', 'end', 'nextJob', 'scriptId', 'pipelineId', 'options', 'commands', 'createdAt']});
        //    console.log("Jobs list", jobsList);
           if(jobsList.length == 0){
               res({'status':true, 'message':jobsList});
               return;
           }
           if(objIsEmpty(jobsList[0].dataValues)){
               rej(Error({'status':false, 'message':'NO_JOBS_RETURNED'}));
               return;
           }
           else{
                jobsArray = [];
                for(let i of jobsList){
                    jobsArray.push(i.dataValues);
                }
                res({'status':true, 'message':jobsArray});
                return;
           }
        });
        
    }


