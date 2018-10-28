const jobs_model = require('../models').Jobs;
const objIsEmpty = require('../utilfunctions').objIsEmpty;
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
            return {'status':false, 'messsage':"no job ID provided"}
        }

        if(!job.id)
        {
            return {'status':false, 'messsage':"no job ID provided"}
        }
        let jobID =  job.id;

        let jobStatus = await jobs_model.findOne({'where': {'id':jobID}, 'attributes':['status']})

        if(objIsEmpty(jobStatus)){
            return {'status':false, 'message':"job info was returned as empty from DB. Could not find job."}
        }

        return {'status': true, 'message': jobStatus};
    }


