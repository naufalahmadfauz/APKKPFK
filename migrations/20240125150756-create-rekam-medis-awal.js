'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rekam_medis_awal', {
      id_rekam_medis_awal: {
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
      berat_badan: {
        type: Sequelize.INTEGER
      },
      tinggi_badan: {
        type: Sequelize.INTEGER
      },
      tekanan_darah_sistolik: {
        type: Sequelize.INTEGER
      },
      tekanan_darah_diastolik: {
        type: Sequelize.INTEGER
      },
      suhu_badan: {
        type: Sequelize.INTEGER
      },
      riwayat_penyakit: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rekam_medis_awal');
  }
};