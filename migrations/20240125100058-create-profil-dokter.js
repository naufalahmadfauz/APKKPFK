'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profil_dokter', {
      id_dokter: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      nama_dokter: {
        type: Sequelize.STRING
      },
      jenis_dokter: {
        type: Sequelize.STRING
      },
      status_dokter: {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profil_dokter');
  }
};