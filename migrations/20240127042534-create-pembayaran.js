'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pembayaran', {
      id_pembayaran: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      id_rekam_medis: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_registrasi_pasien: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_pembayaran: {
        type: Sequelize.INTEGER
      },total_pembayaran_jkn: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('pembayaran');
  }
};