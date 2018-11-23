


var express = require('express');
var router = express.Router();

const usersController = require('../../controllers/usersController');



router.get('/FilesList', async function(req, res, next) {
  
    let username = req.body.username
  
    let response = await usersController.getUserFiles(username);

    if(response.status == 'false'){
        return {'status': false, 'message':response.message};
    }
    else{
       return res.status(200).json({
        'status':true,
        'message':response.message
        });
    }
});