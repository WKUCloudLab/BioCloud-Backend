var express = require('express');
var router = express.Router();
const ipc=require('node-ipc');
// var isAuthenticated = require('../isAuthenticated').ensureLocalAuthenticated;
const jwt = require('jsonwebtoken');


const jobsController = require('../../controllers/jobsController');

router.get('/', async function(req, res) {
    let jwt =  jwt.verify(req.body.token, 'shhhhh');
    res.status(200).json({
      'status':true,
      'message':'welcome to the jobs route!'
    });
  });

  router.post('/jobStatus',  async function(req, res) {
    if(!req.body){
      return res.status(400).json({
          'status':false,
          'message':'No jobs supplied to this api route'
        });
  }
  let jobStatus = await jobsController.jobGetStatus(req.body);

  if(!jobStatus){
    return res.status(400).json({
      'status':false,
      'message':'No job found with that ID or ID supplied was wrong'
    });
  }

    res.status(200).json({
      'status':true,
      'message':'welcome to the jobs route!'
    });
  });

  router.post('/jobsList',  async function(req, res) {
    let decoded = {};

    if(!req.body){
        return res.json({
            'status':false,
            'message':'NO_REQUEST_BODY_PROVIDED'
        });
    }
    if(!req.body.token){
        return res.json({
            'status':false,
            'message':'NO_USERNAME_PROVIDED'
        });
    }
    try{
        decoded = jwt.verify(req.body.token, "BioCloud");
        console.log("decoded:", decoded);
    }
    catch(err){
        // console.log(err);
        return;
    }
    let jobList = {};
    try{
        jobList = await jobsController.getJobsList(decoded.userID);
    }
    catch(e){
        if(e){
            console.log(e);
        }
    }
    // console.log(jobList.message)
    res.json({'status':true, 'message':jobList.message});

});

  router.post('/create', async function(req, res) {
      console.log("Create Job");
    if(!req.body){
        return res.status(400).json({
            'status':false,
            'message':'No jobs supplied to this api route'
          });
    }
    console.log(`Request body ${req.body}`);
    let jobsCreated = {}
    try{
        jobsCreated = await jobsController.submitJob(req.body);
    }
    catch(e){
        if(e){
            console.log(e);
            return
        }
    }
    console.log("jobsCreated", jobsCreated);
    if(!jobsCreated){
        return res.status(200).json({
            'status':false,
            'message':'failed to submit job to database'
          });
    }
    console.log(jobsCreated.message[0].dataValues);


  console.log("Opening ipc socket to middleware");
    //need to spawn kubernetes jobs here with ID
  //this is  the job id
  ipc.config.id = jobsCreated.message[0].dataValues.id;

  ipc.connectTo(
      'world',
      function(){
          ipc.of.world.on(
              'connect',
              function(){
                  ipc.log('## connected to world ##', ipc.config.delay);
                  ipc.of.world.emit(
                      'app.message',
                      {
                          id : ipc.config.id,
                          message : 'hello'
                      }
                  );
              }
          );
          ipc.of.world.on(
              'disconnect',
              function(){
                  ipc.log('disconnected from world');
              }
          );
          ipc.of.world.on(
              'app.message',
              function(data){
                  ipc.log('got a message from world : ', data);

              }
          );

          ipc.of.world.on(
            'Job.created',
            function(data){
              console.log("recieved response");
              ipc.log('got a message from world : ', data);
              ipc.disconnect('world');
              return;
          }
          )

          console.log(ipc.of.world.destroy);
      }
  );

  console.log("passed message")

    res.status(200).json({
      'status':true,
      'message':'Successfully created job!'
    });
  });

  module.exports = router;
