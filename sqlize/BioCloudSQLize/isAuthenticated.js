module.exports.ensureLocalAuthenticated = (req, res, next) =>{
    console.log(req.user);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) { return next(); }
    else{
        res.json({'status': true, 'message':"USER_NOT_AUTHENTICATED"});
    }
    // res.redirect('/login');
  }