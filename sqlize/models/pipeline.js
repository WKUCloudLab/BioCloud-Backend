'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pipeline = sequelize.define('Pipeline', {
    id: DataTypes.INTEGER
  }, {});
  Pipeline.associate = function(models) {
    // associations can be defined here
  };
  return Pipeline;
};