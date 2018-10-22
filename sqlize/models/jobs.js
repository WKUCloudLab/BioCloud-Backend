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
        model: sequelize.models.Jobs,
        key:"id"
      }
    },
    scriptId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    pipelineId: DataTypes.INTEGER,
    options: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    commands:{
      type: DataTypes.STRING
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
    console.log('here4');
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