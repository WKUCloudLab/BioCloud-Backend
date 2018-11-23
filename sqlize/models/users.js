'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate:{
        isEmail: true
      },
      unique:true
      
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    getterMethods:{
      fullname(){
        return this.firstName + " " + this.lastName;
      },

    },
    setterMethods: {
      fullname(value){
        const names = value.split(" ");

        this.setDataValue('firstName', names.slice(0, -1).join(' '));
        this.setDataValue('lastName', names.slice(-1).join(' '));
      }
    }
  });
  Users.associate = function(models) {
    // associations can be defined here
    console.log('here6');
    Users.hasMany(models.Jobs, {
      foreignKey: "userId",
      as: 'jobs'
    });
    console.log('here7');
    Users.hasMany(models.Files, {
      foreignKey: "userId",
      as: 'files'
    });

  };
  console.log("Users:");
  console.log(Users);
  return Users;
};