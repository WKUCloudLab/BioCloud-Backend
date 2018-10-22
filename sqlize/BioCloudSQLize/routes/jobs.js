var express = require('express');
var router = express.Router();

const jobsController = require('../../controllers/jobsController');

router.post('/', function(req, res, next) {

        if(!req.body){
            res.json({status: false, message: 'did not recieve job request'});
        }
        console.log(typeof(req.body))
        console.log("req.body: ", req.body.jobsList);

        console.log(jobsController);
    jobsController.submitJob(req.body);
    res.status(200).json({
        'status':true,
        'message':'Successfully '  
    });
});

router.get('/', (req, res, next)=>{
    console.log("welcome to create jobs route");
    res.status(200).json({
        'status':true,
        'message':'welcome to create jobs route!'
    });
})



module.exports = router;