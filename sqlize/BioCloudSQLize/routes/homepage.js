var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next){
    console.log(req.session);
    res.render('profile', {
        title: 'Home',
        username: "chan",
        // isLoggedIn: true,
    });


});

module.exports = router;