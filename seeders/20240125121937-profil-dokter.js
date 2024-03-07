'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profil_dokter', [
      {
        id_dokter: 'PDU-8473-1',
        nama_dokter: 'Dokter Akbar ',
        jenis_dokter: 'Dokter Umum',
        status_dokter: 'Aktif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_dokter: 'PDG-3523-1',
        nama_dokter: 'Dokter Riri ',
        jenis_dokter: 'Dokter Gigi',
        status_dokter: 'Aktif',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profil_dokter', null, {});
  }
};