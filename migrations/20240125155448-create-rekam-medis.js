'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rekam_medis', {
      id_rekam_medis: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      id_registrasi_pasien: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'data_pasien',
          key: 'id_registrasi_pasien'
        }
      },
      id_rekam_medis_awal: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'rekam_medis_awal',
          key: 'id_rekam_medis_awal'
        }
      },
      id_dokter: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'profil_dokter',
          key: 'id_dokter'
        }
      },
      hasil_lab: {
        type: Sequelize.STRING
      },
      gejala: {
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
    await queryInterface.dropTable('rekam_medis');
  }
};