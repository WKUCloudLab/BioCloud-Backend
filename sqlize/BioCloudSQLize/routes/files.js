


var express = require('express');
var router = express.Router();

const usersController = require('../../controllers/usersController');



router.post('/filesList', async function(req, res, next) {
    console.log("fileslist");
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


module.exports = router;