var express = require('express');
var router = express.Router();
var isAuthenticated = require('../isAuthenticated');

router.get('/', isAuthenticated.ensureLocalAuthenticated, function(req, res, next){
    console.log(req.isAuthenticated());
    res.render('anotherpage', {
        title: 'Another Page',
        username: req.session.passport.user,
        isLoggedIn: true,
        });


});

module.exports = router;