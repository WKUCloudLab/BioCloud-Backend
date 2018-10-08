'use strict';

var fs = require('fs');


module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define('Files', {
    userId: { 
      type:DataTypes.INTEGER,
      references:{
        model: Users,
        key: 'id'
      }
    },
    jobId:{
      type:DataTypes.INTEGER,
      references:{
        model: Jobs,
        key: 'id'
      }
    } ,
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    created: DataTypes.DATE,
    path: {
      type:DataTypes.STRING,
      validate:{
        isPath(value){
          const regex = /^(?:\.{2})?(?:\/\.{2})*(\/[a-zA-Z0-9]+)+$/;
          if(regex.test(value)){
            //might want to actually query the path on the system and see if file exists
            if(!fs.existsSync(value)){
              throw new Error("Path does not actually exist on system.")
            }
          }else{
            throw new Error("Invalid path string.")
          }
        }
      }
    },
    filetype: DataTypes.STRING,
    locked:{
      type:DataTypes.ENUM,
      values: ["LOCKED", "UNLOCKED"]
    } ,
    howCreated:{
      type: DataTypes.ENUM,
      values: ["DOWNLOADED", "OUTPUT"]
    }
  }, {});
  Files.associate = function(models) {
    // associations can be defined here

    Files.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    Files.belongsTo(models.Jobs, {
      foreignKey: 'jobId',
      targetKey: 'id'
    });


  };
  return Files;
};