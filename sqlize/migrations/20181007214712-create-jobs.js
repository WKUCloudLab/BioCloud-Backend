'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM,
        values: ['INIT','ENQUEUE','INPROCESS','COMPLETE','FAILED'],
      },
      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
      },
      nextJob: {
        type: Sequelize.INTEGER
      },
      scriptId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
          model: "Users",
          key: "id"
        }
      },
      pipelineId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Pipelines',
          key: 'id'
        }
      },
      options: {
        type: Sequelize.STRING,
        allowNull: false
      },
      commands:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, 
    );

    
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Jobs');
  }
};