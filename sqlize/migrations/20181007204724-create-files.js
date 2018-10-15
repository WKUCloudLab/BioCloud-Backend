'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Users',
          key: 'id'
        }
      },
      jobId: {
        type: Sequelize.INTEGER,
        references:{
            model: 'Jobs',
            key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE
      },
      path: {
        type: Sequelize.STRING
      },
      filetype: {
        type: Sequelize.STRING
      },
      locked: {
        type: Sequelize.ENUM,
        values: ["LOCKED", "UNLOCKED"]
      },
      howCreated: {
        type: Sequelize.ENUM,
        values: ["DOWNLOADED", "OUTPUT"]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Files');
  }
};