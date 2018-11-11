const users_model = require('../models').Users;


module.exports.register = async (username, password, email, firstname, lastname)=>{
        if(!username || !password || !email || !firstname || !lastname){
            return {'status': false, 'message': "missing required info"}
        }
        console.log("username " + username + " password " + password + " email " + email + " firstname " + firstname + " lastname " + lastname);
        console.log(users_model);
        let userCreated;
        try{
            userCreated = await users_model.create({'username': username, 'password':password, 'email':email, 'firstName':firstname, 'lastName':lastname});
        }
        catch(err){
            if(err){
                return {'status': false, 'message':"USERNAME_EMAIL_UNAVAILABLE"};
            }
        }
        
        if(!userCreated){
            return {'status': false, 'message':"Unable to create the account."}
        }
        else{
            return {'status': true, 'message':userCreated};
        }
    }
