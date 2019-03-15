


var express = require('express');
var router = express.Router();

const usersController = require('../../controllers/usersController');
const checkToken = require("../isAuthenticated").checkToken;


router.post('/filesList', async function(req, res, next) {
    let token = checkToken(req);
    let username = token.userID;
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
