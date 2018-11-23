const express = require('express');
const router = express.Router();

const passport = require('passport');
const loginController = require('../../controllers/loginController');
const jwt = require('jsonwebtoken');


//deprecated in favor of jwts
// router.post('/',
//    function(req, res, next) {
//      console.log(req.body);
//     passport.authenticate('local', function(err, user, info) {
//       console.log("user in authenticate ", user);
//         if (err) { return next(err); }
//         if (!user) { return res.json({
//             'status':false,
//             'message':'No user by that username'
//           }); }
//         req.logIn(user, function(err) {
//           if (err) { return next(err); }
//           console.log("session ", req.session);
//           return res.status(200).json({
//             'status':true,
//             'message':"Welcome " + user.username +"!"
//           });
//           // res.redirect('homepage');
          
//         });
//       })(req, res, next);
//   });

router.post('/', async (req, res)=>{
  console.log('/login');
  const body = req.body;
  let username = body.username;
  let password = body.password;
  let user = {};
  try{
     user = await loginController.login(username, password);
  }
  catch(e){
    if(e){
      console.log("Error ", e);
      return res.send({'status':false, 'message':'ERROR'});
    }
  }
   console.log(user)
       if(user.status == true){
        var token = jwt.sign({userID: user.id}, 'BioCloud', {expiresIn: '2h'});
         return res.send({'status':true, 'message':token});
       }
       else{
         return res.send({'status':false, 'message':'NO_USER_FOUND'});
       }
});

  router.get('/',
   function(req, res, next) {
     res.render('login');
   })

  module.exports = router;