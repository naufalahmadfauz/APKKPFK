// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const detailPengadaanObatRecords = await queryInterface.sequelize.query(
//       `SELECT * FROM detail_pengadaan_obat`
//     );
//
//     const stokObatRecords = detailPengadaanObatRecords[0].map((record, index) => {
//       const randomNum = Math.floor(Math.random() * 9000) + 1000;
//       const idStokObat = `SO-${randomNum}-${index + 1}`;
//
//       // Create a new date object for the start date
//       const date = new Date('2023-01-01');
//
//       // Increment the date by the index
//       date.setDate(date.getDate() + index);
//
//       return {
//         id_stok_obat: idStokObat,
//         id_obat: record.id_obat,
//         nomer_batch: record.nomer_batch,
//         expire: record.expire,
//         jumlah: record.jumlah,
//         satuan: record.satuan,
//         harga_satuan: record.harga_satuan,
//         tipe_obat: record.harga_satuan,
//         createdAt: date,
//         updatedAt: new Date()
//       };
//     });
//
//     return queryInterface.bulkInsert('stok_obat', stokObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('stok_obat', null, {});
//   }
// };
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const detailPengadaanObatRecords = await queryInterface.sequelize.query(
      `SELECT detail_pengadaan_obat.*, pengadaan_obat.jenis_pengadaan_obat
       FROM detail_pengadaan_obat
       JOIN pengadaan_obat ON detail_pengadaan_obat.id_pengadaan_obat = pengadaan_obat.id_pengadaan_obat`
    );

    const stokObatRecords = detailPengadaanObatRecords[0].map((record, index) => {
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const idStokObat = `SO-${randomNum}-${index + 1}`;

      // Create a new date object for the start date
      const date = new Date('2023-01-01');

      // Increment the date by the index
      date.setDate(date.getDate() + index);

      return {
        id_stok_obat: idStokObat,
        id_obat: record.id_obat,
        nomer_batch: record.nomer_batch,
        expire: record.expire,
        jumlah: record.jumlah,
        satuan: record.satuan,
        harga_satuan: record.harga_satuan,
        tipe_obat: record.jenis_pengadaan_obat, // Set tipe_obat to jenis_pengadaan_obat
        createdAt: date,
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('stok_obat', stokObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('stok_obat', null, {});
  }
};