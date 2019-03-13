var express = require("express");
var router = express.Router();
const ipc = require("node-ipc");
// var isAuthenticated = require('../isAuthenticated').ensureLocalAuthenticated;
const jwt = require("jsonwebtoken");

const jobsController = require("../../controllers/jobsController");

router.get("/", async function(req, res) {
  let jwt = jwt.verify(req.body.token, "shhhhh");
  res.status(200).json({
    status: true,
    message: "welcome to the jobs route!"
  });
});

router.post("/jobStatus", async function(req, res) {
  if (!req.body) {
    return res.status(400).json({
      status: false,
      message: "No jobs supplied to this api route"
    });
  }
  let jobStatus = await jobsController.jobGetStatus(req.body);
 
  if (!jobStatus) {
    return res.status(400).json({
      status: false,
      message: "No job found with that ID or ID supplied was wrong"
    });
  }

  res.status(200).json({
    status: true,
    message: "welcome to the jobs route!"
  });
});

router.post("/jobsList", async function(req, res) {
  let decoded = {};

  if (!req.body) {
    return res.json({
      status: false,
      message: "NO_REQUEST_BODY_PROVIDED"
    });
  }
  if (!req.body.token) {
    return res.json({
      status: false,
      message: "NO_USERNAME_PROVIDED"
    });
  }
  try {
    decoded = jwt.verify(req.body.token, "BioCloud");
    console.log("decoded:", decoded);
  } catch (err) {
    // console.log(err);
    return;
  }
  let jobList = {};
  try {
    jobList = await jobsController.getJobsList(decoded.userID);
  } catch (e) {
    if (e) {
      console.log(e);
    }
  }
  // console.log(jobList.message)
  res.json({ status: true, message: jobList.message });
});

// Refactoring into better routing approach
// Taking out IPC
router.post("/create", jobsController.submitJob)


module.exports = router;
