const jobs_model = require("../models").Jobs;
const objIsEmpty = require("../utilfunctions").objIsEmpty;
const usersController = require("./usersController");
const waitEnqueue = require("./jobsScheduler").waitEnqueue
const pushToReady = require("./jobsScheduler").pushToReady
const mom = require("moment");

module.exports.submitJob = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: false,
      message: "No jobs supplied"
    })
  }

  let jobsCreated = jobs.jobsList.map(job => {
    return new Promise((resolve, reject) => {
      let jobToSubmit = {};
      jobToSubmit.name = job.name;
      jobToSubmit.scriptId = i.options.script.name;
      if (!job.username) {
        jobToSubmit.userId = "Jamie";
      } else {
        jobToSubmit.userId = job.username;
      }
      jobToSubmit.userId = 1;  // Not sure of the logic here, just refactoring
      jobToSubmit.options = job.entry;
      jobToSubmit.start = mom(job.created).format();
      jobToSubmit.status = "INIT";
      // Create job in database
      jobs_model.create(jobToSubmit).then(
        jobCreated => {
          resolve(jobCreated)
        }
      ).catch(err => reject(err))
    })
  })

  Promise.all(jobsCreated).then(jobs => {
    waitEnqueue(jobs).then((success) => {
        res.status(200).json({
          status: true,
          message: "Successfully created job!",
        })
    }).catch(err => {
      res.status(400).json({
        status: false,
        message: "Jobs failed to enqueue"
      })
    })
  })
  .catch(err => {
    return res.status(400).json({
      status: false,
      message: "Job failed to submit to database",
      err
    })
  })

};

(module.exports.jobGetInfo = jobID => {
  return new Promise(async (res, rej) => {
    if (!jobID) {
      rej(Error({ status: false, messsage: "no job ID provided" }));
      return;
    }
    let jobInfo = await jobs_model.findById(jobID);

    if (objIsEmpty(jobInfo)) {
      res({
        status: false,
        message: "job info was returned as empty from DB. Could not find job."
      });
      return;
    }

    res({ status: true, message: jobInfo });
    return;
  });
}),
  (module.exports.jobGetStatus = job => {
    return new Promise(async (res, rej) => {
      if (!job) {
        rej(Error({ status: false, messsage: "no job object provided" }));
        return;
      }
      if (!job.id) {
        rej(Error({ status: false, messsage: "no job ID provided" }));
        return;
      }
      let jobID = job.id;
      let jobStatus = {};

      try {
        jobStatus = await jobs_model.findOne({
          where: { id: jobID },
          attributes: ["status"]
        });
      } catch (err) {
        if (err) {
          rej(Error({ status: false, messsage: "ERROR_FINDING_JOB_BY_ID" }));
          return;
        }
      }
      if (objIsEmpty(jobStatus) || objIsEmpty(jobStatus.dataValues)) {
        res({
          status: false,
          message: "job info was returned as empty from DB. Could not find job."
        });
        return;
      }

      res({ status: true, message: jobStatus.dataValues });
      return;
    });
  });

module.exports.getJobsList = username => {
  return new Promise(async (res, rej) => {
    if (!username) {
      rej({ status: false, messsage: "NO_USERNAME_PROVIDED" });
      return;
    }
    //this will return an aobject that looks like {'status': [true or false], message:[failure message or userId]}
    let userId = await usersController.getUserIDByUsername(username);
    let jobsList = await jobs_model.findAll({
      where: { userId: userId.message },
      attributes: [
        "id",
        "status",
        "start",
        "end",
        "nextJob",
        "scriptId",
        "pipelineId",
        "options",
        "commands"
      ]
    });
    //    console.log("Jobs list", jobsList);
    if (jobsList.length == 0) {
      res({ status: true, message: jobsList });
      return;
    }
    if (objIsEmpty(jobsList[0].dataValues)) {
      rej(Error({ status: false, message: "NO_JOBS_RETURNED" }));
      return;
    } else {
      jobsArray = [];
      for (let i of jobsList) {
        jobsArray.push(i.dataValues);
      }
      res({ status: true, message: jobsArray });
      return;
    }
  });
};
