const jobs_model = require('../models').Jobs;
const objIsEmpty = require('../utilfunctions').objIsEmpty;


module.exports.submitJob =   async(jobs) => {
        if(!jobs){
            return {'status':false, 'messsage':"empty list of job objects"}
        }
        console.log("jobs", jobs);
        let jobCreated;
        let jobsList = []
        for(i of jobs){
            console.log(i);
            jobCreated = await jobs_model.create(i);
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

    module.exports.jobGetStatus = async (jobID)=>{
        if(!jobID){
            return {'status':false, 'messsage':"no job ID provided"}
        }

        let jobStatus = await jobs_model.findOne({'where': {'id':jobID}, 'attributes':['status']})

        if(objIsEmpty(jobStatus)){
            return {'status':false, 'message':"job info was returned as empty from DB. Could not find job."}
        }

        return {'status': true, 'message': jobStatus};
    }


