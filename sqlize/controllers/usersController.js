const users_model = require('../models').users;

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

    }

    


    


}