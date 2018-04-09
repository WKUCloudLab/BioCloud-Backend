var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){
    if((req.session && req.session.username)){
        
    }
	else{
		res.redirect('/login');
    }
    

});