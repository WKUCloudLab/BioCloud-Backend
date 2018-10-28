'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate:{
        isEmail: true
      }
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {

    getterMethods:{
      fullname(){
        return this.firstName + " " + this.lastName;
      }
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
    Users.hasMany(models.Jobs, {
      foreignKey: "userId",
      as: 'jobs'
    });

    Users.hasMany(models.Files, {
      foreignKey: "userId",
      as: 'files'
    });
    
  };
  return Users;
};