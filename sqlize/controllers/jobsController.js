const jobs_model = require('../models').Jobs;
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const usersController = require('./usersController');
const mom = require('moment');


module.exports.submitJob =   async(jobs) => {
        if(!jobs){
            return {'status':false, 'messsage':"empty list of job objects"}
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
                return {'status':false, 'messsage':`did not create job ${i}`}
            }
            jobsList.push(jobCreated);
        }

        return {'status':true, 'message':jobsList};
    };

    module.exports.jobGetInfo = async (jobID) => {
        if(!jobID){
            return {'status':false, 'messsage':"no job ID provided"}
        }
        let jobInfo = await jobs_model.findById(jobID);

        if(objIsEmpty(jobInfo)){
            return {'status':false, 'message':"job info was returned as empty from DB. Could not find job."}
        }

        return {'status':true, 'message':jobInfo};
    },

    module.exports.jobGetStatus = async (job)=>{
        if(!job){
            return {'status':false, 'messsage':"no job object provided"}
        }
        if(!job.id)
        {
            return {'status':false, 'messsage':"no job ID provided"}
        }
        let jobID =  job.id;

        try{
            let jobStatus = await jobs_model.findOne({'where': {'id':jobID}, 'attributes':['status']})
        }
        catch(err){
            if(err){
                return {'status':false, 'messsage':"ERROR_FINDING_JOB_BY_ID"}
            }
        }
        if(objIsEmpty(jobStatus) || objIsEmpty(jobStatus.dataValues)){
            return {'status':false, 'message':"job info was returned as empty from DB. Could not find job."}
        }

        return {'status': true, 'message': jobStatus.dataValues};
    }

    module.exports.getJobsList = async (username)=>{
        if(!username){
            return {'status':false, 'messsage':"NO_USERNAME_PROVIDED"}
        }
        //this will return an aobject that looks like {'status': [true or false], message:[failure message or userId]}
        let userId = usersController.getUserIDByUsername(user)
       let jobsList =  await jobs_model.findAll({'where': {'userId':userId.message.id}});
       if(objIsEmpty(jobsList.dataValues)){
           return{'status':false, 'message':'NO_JOBS_RETURNED'};
       }
       else{
            return{'status':true, 'message':jobsList.dataValues};
       }
    }


