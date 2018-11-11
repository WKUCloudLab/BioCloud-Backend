const users_model = require('../models').Users;


module.exports.login =  async (username, password)=>{

        console.log("login controller");
        let validUser = await users_model.findOne({'where': {'username':username}});
        
        if(!validUser){
            return {'status':false, 'message':"no user by that user name"}
        }
        // console.log("username", validUser.dataValues.username)
        if(validUser.dataValues.password === password){
            return {'status':true, 'message':validUser}
        }
        else{
            return {'status':false, 'message':"Invalid Password"};
        }
    }

    module.exports.deserialize = async (username) => {
        // console.log(username);
        let user = await users_model.findOne({'where': {'username':username}});
        // console.log(user);
        return {'status': true, 'message': user.dataValues};
    }
