const users_model = require('../models').users;
const objIsEmpty = require('../utilfunctions').objIsEmpty;

module.exports = {
    async create(usrInfo){
        return users_model.findOrCreate(usrInfo);
    },

    //need to make sure username is their own
    async getUserByUsername(username){
        let response = await users_model.findOne({'where':{'username':username}});

        if(response === null){
            response.message = `unable to find ${username}`;
        }
        return response;
    },

    //need to make sure the email they pass is their own email
    async getUserByEmail(email){
        let response = await users_model.findOne({'where':{'email': email}})
        
        if(response === null){
            response.message = `unable to find user by email ${email}`;
        }

        return response;
    },
    async getUserFiles(username){
        let userFiles = users_model.findAll({'where':{'username': username}, 'include':[{'model': 'Files', 'required': true}], 'attributes':[['Files.path', 'path'], ['Files.name', 'filename']]})
        for(file of userFiles){
            arrOfFiles.push(userFiles[file].path + userFiles[file].filename)
        }

        return arrOfFiles;

    },

    async getUserIDByUsername(username){
        if(!username){
            return{'status':false, 'message': 'NO_USERNAME_PROVIDED'}
        }
        let username = await users_model.findOne({'where':{'username':username}, attributes:['id']});

        if(objIsEmpty(username.dataValues)){
            return{'status':false, 'message': 'NO_USERNAME_FOUND'}
        }
        else{
            return {'status':true, 'message': username.dataValues.id}
        }


    }


    


}