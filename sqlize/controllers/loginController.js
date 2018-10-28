const users_model = require('../models').users;

module.exports = {
    async login(username, password){
        let validUser = await users_model.findOne(username);
        if(!validUser){
            return {'messsage':"no user by that user name"}
        }

        let userPassword = users_model.findOne({'where':{
            'username': validUser
        },
        'attributes':['password']
    })

    if(userPassword === password){
        return true;
    }
    }
}