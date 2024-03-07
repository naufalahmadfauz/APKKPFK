'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const penguranganObatRecords = Array.from({ length: 5 }, (_, index) => {
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const idPenguranganObat = `PGO-${randomNum}-${index + 1}`;

      return {
        id_pengurangan_obat: idPenguranganObat,
        status_pengurangan_obat: 'Disetujui',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('pengurangan_obat', penguranganObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pengurangan_obat', null, {});
  }
};