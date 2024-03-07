// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const recordCount = 10;
//
//     const penguranganObatRecords = Array.from({ length: recordCount }).map((_, index) => {
//       const randomNum = Math.floor(Math.random() * 9000) + 1000;
//       const idPenguranganObat = `PO-${randomNum}-${index + 1}`;
//       const totalKerugian = Math.floor(Math.random() * (5000000 - 2000000 + 1)) + 2000000;
//
//       // Create a new date object for the start date
//       const date = new Date('2023-01-01');
//
//       // Increment the date by the index
//       date.setDate(date.getDate() + index);
//
//       return {
//         id_pengurangan_obat: idPenguranganObat,
//         total_kerugian: totalKerugian,
//         status_pengurangan_obat: 'Disetujui',
//         createdAt: date,
//         updatedAt: new Date()
//       };
//     });
//
//     return queryInterface.bulkInsert('pengurangan_obat', penguranganObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('pengurangan_obat', null, {});
//   }
// };
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const recordCount = 10;

    const penguranganObatRecords = Array.from({ length: recordCount }).map((_, index) => {
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const idPenguranganObat = `PO-${randomNum}-${index + 1}`;
      const totalKerugian = Math.floor(Math.random() * (5000000 - 2000000 + 1)) + 2000000;

      // Create a new date object for the start date
      const date = new Date('2023-01-01');

      // Increment the date by the index
      date.setDate(date.getDate() + index);

      return {
        id_pengurangan_obat: idPenguranganObat,
        total_kerugian: totalKerugian,
        status_pengurangan_obat: 'Disetujui',
        createdAt: date,
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('pengurangan_obat', penguranganObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pengurangan_obat', null, {});
  }
};