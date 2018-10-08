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
    },
    end: DataTypes.DATE,
    nextJob: {
      type:DataTypes.INTEGER,
      references:{
        model: Jobs,
        key:"id"
      }
    },
    scriptId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    pipelineId: DataTypes.INTEGER,
    commands: {
      type: DataTypes.STRING,
      allowNull:false,
    }
  }, {});
  Jobs.associate = function(models) {
    // associations can be defined here
    Jobs.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'

    });

    Jobs.belongsTo(models.Pipelines, {
      foreignKey: "pipelineId",
      targetKey: 'id'
    });

    Jobs.hasMany(models.Files,{
      foreignKey: "jobId",
      as: files,
    })

  };
  return Jobs;
};