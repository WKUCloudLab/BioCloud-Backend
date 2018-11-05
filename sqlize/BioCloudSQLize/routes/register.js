var express = require('express');
var router = express.Router();

const registerController = require('../../controllers/registerController');

router.post('/', async function(req, res, next) {
    
    if(!req.body){
        return res.status(400).json({'status':false, 'message': 'No register info found'})
    }
    console.log(req.body);
    let register = await registerController.register(req.body.username, req.body.password, req.body.email, req.body.firstname, req.body.lastname)

    console.log(register);
    res.status(200).send(register);

});

router.get('/', function(req, res, next) {
    res.render('register');
})

module.exports = router;