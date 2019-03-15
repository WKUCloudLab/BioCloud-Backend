const jwt = require("jsonwebtoken");

module.exports.checkToken = (req)=>{
        var loginToken = req.headers.authentication || req.body.token || req.headers.Bearer;
	try{
        var decoded = jwt.verify(loginToken, 'BioCloud');
        return decoded
        }catch(error){
                console.log("error getting token", error);
        }

}


module.exports.ensureLocalAuthenticated = (req, res, next) =>{
    console.log(req.user);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) { return next(); }
    else{
        res.json({'status': true, 'message':"USER_NOT_AUTHENTICATED"});
    }
    // res.redirect('/login');
  }
