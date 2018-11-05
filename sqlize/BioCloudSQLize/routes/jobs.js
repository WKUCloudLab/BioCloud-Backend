var express = require('express');
var router = express.Router();
const ipc=require('node-ipc');


const jobsController = require('../../controllers/jobsController');

router.get('/', async function(req, res) {
    res.status(200).json({
      'status':true,
      'message':'welcome to the jobs route!'
    });
  });

  router.get('/jobStatus', async function(req, res) {
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

  router.post('/', async function(req, res) {
    if(!req.body){
        return res.status(400).json({
            'status':false,
            'message':'No jobs supplied to this api route'
          });
    }
    console.log(`Request body ${req.body}`);
    let jobsCreated = await jobsController.submitJob(req.body);
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
  ipc.config.id = jobsCreated.message[0].dataValues;

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