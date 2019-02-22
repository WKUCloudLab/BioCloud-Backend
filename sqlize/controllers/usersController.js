const users_model = require('../models').Users;
const files_model = require('../models').Files;
const objIsEmpty = require('../utilfunctions').objIsEmpty;

module.exports = {
    //     create(usrInfo){
    //         return new Promise((res, rej)=>{
    //             let createUser;
    //             try{
    //                 createUser = users_model.findOrCreate(usrInfo);
    //             }
    //             catch(err){
    //                 rej(Error({'status':false, 'message':err});
    //             }
    //         })
        
    // },

    //need to make sure username is their own
    getUserByUsername(username){
        return new Promise(async (res, rej)=>{
            let response;
            try{
             response = await users_model.findOne({'where':{'username':username}});
            }
            catch(err){
                rej({'status':false, 'message':err})
            }
            if(response ===null || objIsEmpty(res)){
                res({'status':false, 'message':"NO_USER_BY_THAT_USERNAME"});
            }
            else{
                res({'status':true, 'message':response.dataValues.username});
            }
        })

    },

    //need to make sure the email they pass is their own email
    getUserByEmail(email){
        return new Promise(async (res, rej)=>{
            let response
            try{
                response = await users_model.findOne({'where':{'email': email}})
            }
            catch(err){
                rej({'status':false, 'message':err});
            }
            if(response === null){
                response.message = `unable to find user by email ${email}`;
            }
            res({'status':true, 'message':response});
        })
        
    },
    getUserFiles(username){
        return new Promise(async (res, rej)=>{
            let userFiles={};
        try{
            //this needs to be reworked into one query for the table
            console.log("User Files", username)
            userId = await users_model.findOne({'where':{'username':username}, attributes:['id']});
            if(objIsEmpty(userId.dataValues)){
                rej(Error({'status': false, 'message': "NO_USER_FOUND"}));
                return;
            }
            console.log("getFiles: ", userId);
            userFiles = await files_model.findAll({'where':{'userId': userId.dataValues.id}, 'attributes':['id', 'path', 'name', 'size', 'jobId', 'userId', 'filetype', 'locked', 'howCreated',  'createdAt']})
        }
        catch(err){
            if(err){
                console.log("Error getting user files:", err);
                rej(Error({
                    'status':false,
                    'message':"UNABLE_TO_LOCATE_USER_FILES"
                }));
                return;
            }
        }
        console.log(userFiles);
        arrOfFiles = [];
        for(file of userFiles){
            console.log(file)
            arrOfFiles.push(file.dataValues);
        }

        res({'status': true, 'message':arrOfFiles});
        });
        

    },

    async getUserIDByUsername(username){
        return new Promise(async function(res, rej){
            if(!username){
                rej(Error({'status':false, 'message': 'NO_USERNAME_PROVIDED'}));
            }
            let userId;
            try{
                userId = await users_model.findOne({'where':{'username':username}, attributes:['id']});
            }
            catch(err){
                //might need to do further checking on specifically what errors
                rej(Error({'status':false, 'message':err}))
            }
            if(objIsEmpty(userId.dataValues)){
                res({'status':false, 'message': 'NO_USERNAME_FOUND'})
            }
            else{
                res({'status':true, 'message': userId.dataValues.id});
            }
        })



    }


    


}
