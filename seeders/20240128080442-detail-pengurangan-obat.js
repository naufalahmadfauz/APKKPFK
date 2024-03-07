'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const penguranganObatRecords = await queryInterface.sequelize.query(
      `SELECT * FROM pengurangan_obat`
    );

    const stokObatRecords = await queryInterface.sequelize.query(
      `SELECT * FROM stok_obat WHERE jumlah > 1`
    );

    const detailPenguranganObatRecords = [];

    for (const penguranganObat of penguranganObatRecords[0]) {
      for (let i = 0; i < 5; i++) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const idDetailPenguranganObat = `${randomNum}-${penguranganObat.id_pengurangan_obat.split('-')[2]}`;

        const randomStokObat = stokObatRecords[0][Math.floor(Math.random() * stokObatRecords[0].length)];

        detailPenguranganObatRecords.push({
          id_detail_pengurangan_obat: idDetailPenguranganObat,
          id_pengurangan_obat: penguranganObat.id_pengurangan_obat,
          id_stok_obat: randomStokObat.id_stok_obat,
          jumlah: 2,
          satuan: randomStokObat.satuan,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        randomStokObat.jumlah -= 2;
      }
    }

    return queryInterface.bulkInsert('detail_pengurangan_obat', detailPenguranganObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('detail_pengurangan_obat', null, {});
  }
};