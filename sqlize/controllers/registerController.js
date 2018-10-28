const users_model = require('../models').users;

module.exports = {
    async register(username, password, email, firstname, lastname){
        let userCreated = await users_model.create({'username': username, 'password':password, 'email':email, 'firstname':firstname, 'lastname':lastname});
        if(!userCreated){
            return {'status': false}
        }
        else{
            return {'status': true, 'user':userCreated};
        }
    }
}