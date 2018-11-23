const users_model = require('../models').Users;


module.exports.register = (username, password, email, firstname, lastname)=>{
    return new Promise(async (res, rej)=>{
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
                console.log("Error creating user", err);
                
                rej(Error({'status': false, 'message':"USERNAME_EMAIL_UNAVAILABLE"}));
            }
        }
        if(!userCreated){
            res({'status': false, 'message':"Unable to create the account."});
        }
        else{
            res({'status': true, 'message':userCreated});
        }
    });

    }
