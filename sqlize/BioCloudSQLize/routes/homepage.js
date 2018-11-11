var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuthenticated = require('../isAuthenticated');

router.get('/', isAuthenticated.ensureLocalAuthenticated, function(req, res, next){
    console.log(req.session);
    res.render('profile', {
        title: 'Home',
        username: "chan",
        // isLoggedIn: true,
    });


});

module.exports = router;