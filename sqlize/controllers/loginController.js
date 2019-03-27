const users_model = require('../models').Users;
const bcrypt = require('bcrypt');

module.exports.login = (username, password)=>{
    return new Promise(async (res, rej)=>{
        console.log("login controller");
        let validUser = await users_model.findOne({'where': {'username':username}});
        
        // hash(plaintextpw, saltrounds, function(err, resultingHashpw))
        bcrypt.hash(password, 11, function(err,hash) {
            console.log(password + "vs" + hash);
            bcrypt.compare(password, hash, function(err, res){
                console.log("res="+res);
            });
        });

        if(!validUser) {
            res({
                status: false, 
                message: "No user by that user name"
            });
            return;
        } else if(validUser.dataValues.password === password) {
            res({
                status: true, 
                message: validUser
            });
            return;
        } else {
            rej(
                Error({
                    status:false, 
                    message:"Invalid Password"
                })
            );
            return;
        }
    })    
}

module.exports.deserialize = (username) => {
    return new Promise( async (res, rej)=>{
        let user = await users_model.findOne({
            where: {
                username: username
            }
        });
        res({
            status: true, 
            message: user.dataValues
        });
        return;
    });
}
