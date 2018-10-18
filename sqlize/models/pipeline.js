'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pipeline = sequelize.define('Pipeline', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {});
  Pipeline.associate = function(models) {
    // associations can be defined here
  };
  return Pipeline;
};