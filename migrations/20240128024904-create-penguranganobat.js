'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pengurangan_obat', {
      id_pengurangan_obat: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      status_pengurangan_obat: Sequelize.STRING,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pengurangan_obat');
  }
};