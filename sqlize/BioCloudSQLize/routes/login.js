var express = require('express');
var router = express.Router();

var passport = require('passport');

router.post('/',
   function(req, res, next) {
     console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
      console.log("user in authenticate ", user);
        if (err) { return next(err); }
        if (!user) { return res.json({
            'status':false,
            'message':'No user by that username'
          }); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          console.log("session ", req.session);
          return res.status(200).json({
            'status':true,
            'message':"Welcome " + user.username +"!"
          });
          // res.redirect('homepage');
          
        });
      })(req, res, next);
  });

  router.get('/',
   function(req, res, next) {
     res.render('login');
   })

  module.exports = router;