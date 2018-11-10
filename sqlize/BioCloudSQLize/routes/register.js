var express = require('express');
var router = express.Router();
const fs = require('fs');

const registerController = require('../../controllers/registerController');

router.post('/', async function(req, res, next) {
    
    if(!req.body){
        return res.status(400).json({'status':false, 'message': 'No register info found'})
    }
    console.log(req.body);
    let register = await registerController.register(req.body.username, req.body.password, req.body.email, req.body.firstname, req.body.lastname)

    if(register.status == false){
        return res.json({'status':false, 'message': register.message});
    }

    await fs.access("/data/users/"+req.body.username, fs.constants.F_OK, async (err)=>{
        if(err){
            console.log(err);
            await fs.mkdir("/data/users/"+req.body.username, (err)=>{
                if(err){
                    throw err;
                }
                console.log(req.body.username + " now has a username");
            });
        }
    });   

    console.log(register);
    return res.status(200).json({'status': true, 'message': req.body.firstname+" registered"});

});

router.get('/', function(req, res, next) {
    res.render('register');
})

module.exports = router;