'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_bpjs', {
      nomer_bpjs: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      id_registrasi_pasien: {
        type: Sequelize.STRING,
        references: {
          model: 'data_pasien', // name of Target model
          key: 'id_registrasi_pasien', // key in Target model that we're referencing
        },
      },
      faskes_tingkat: {
        type: Sequelize.STRING
      },
      kelas_rawat: {
        type: Sequelize.STRING
      },
      foto_kartu_bpjs: {
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
    await queryInterface.dropTable('data_bpjs');
  }
};