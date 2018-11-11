'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jobs = sequelize.define('Jobs', {
    status: {
      type:DataTypes.ENUM,
      values: ['INIT','ENQUEUE','INPROCESS','COMPLETE','FAILED']
    },
    start: {
      type:DataTypes.DATE,
      allowNull:false,
      // validate:{
      //   allowNull:{args:true, msg:"must provide a start date"}
      // }
    },
    end: DataTypes.DATE,
    nextJob: {
      type:DataTypes.INTEGER,
      references:{
        model: sequelize.Jobs,
        key:"id"
      }
    },
    scriptId: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: sequelize.Users
    },
    pipelineId: DataTypes.INTEGER,
    options: {
      type: DataTypes.STRING,
      allowNull:true,
      // validate:{
      //   allowNull:{args:true, msg:"must enter commands list"}
      // }

    },
    commands:{
      type: DataTypes.STRING,
      allowNull:true,
    }
  }, {});
  Jobs.associate = function(models) {
    // associations can be defined here
    console.log('here3');
    Jobs.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'

    });
    Jobs.belongsTo(models.Pipeline, {
      foreignKey: "pipelineId",
      targetKey: 'id'
    });
    console.log('here5');
    Jobs.hasMany(models.Files,{
      foreignKey: "jobId",
      as: 'files',
    })

  };
  return Jobs;
};