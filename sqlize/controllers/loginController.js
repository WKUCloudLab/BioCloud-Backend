const users_model = require('../models').Users;


module.exports.login =  async (username, password)=>{
        console.log("5", username);
        console.log("6", password);
        let validUser = await users_model.findOne({'where': {'username':username}});
        
        if(!validUser){
            return {'status':'failed', 'message':"no user by that user name"}
        }

        let userPassword = users_model.findOne({'where':{
            'username': validUser
        },
        'attributes':['password']
    })

    if(userPassword === password){
        return {'status':'success', 'message':validUser}
    }
    else{
        return {'status':'failure', 'message':"Invalid Password"};
    }
    }
