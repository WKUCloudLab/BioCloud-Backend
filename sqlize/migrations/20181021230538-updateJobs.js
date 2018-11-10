'use strict';
const models = require("../models")

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   console.log(Object.keys(models.Jobs.rawAttributes)[9]);
   let promise1 = queryInterface.changeColumn(models.Jobs.tableName, "options" ,{ 
                  type: Sequelize.STRING,
                  allowNull: true
              });

   let promise2 = queryInterface.addColumn(models.Jobs.tableName, 'commands',{ 
                type: Sequelize.STRING,
                allowNull: true
            });
            console.log("undefined?")
    return Promise.all([promise1, promise2]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   console.log("undefined?")
   let promise1 = queryInterface.changeColumn(models.Jobs.tableName, 'options',{ 
    type: Sequelize.STRING,
    allowNull: true
  });
  console.log("undefined?")
  let promise2 = queryInterface.removeColumn(models.Jobs.tableName, 'commands')
   return Promise.all([promise1, promise2]);

  }
};
