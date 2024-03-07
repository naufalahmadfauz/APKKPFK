'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data_pasien', {
      id_registrasi_pasien: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      nik: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nama_lengkap: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      jenis_kelamin: {
        type: Sequelize.STRING
      },
      tanggal_lahir: {
        type: Sequelize.DATE,
        allowNull: false
      },
      pasien_jkn: {
        type: Sequelize.STRING
      },
      jenis_pasien: {
        type: Sequelize.STRING
      },
      foto_ktp: {
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
    await queryInterface.dropTable('data_pasien');
  }
};