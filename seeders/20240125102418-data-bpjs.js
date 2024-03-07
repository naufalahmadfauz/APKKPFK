'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all data_pasien records where pasien_bpjs is 'Ya'
    const dataPasienRecords = await queryInterface.sequelize.query(
      `SELECT * FROM "data_pasien" WHERE "pasien_bpjs" = 'Ya'`
    );

    // Prepare the data for bulk insert
    const dataBpjsRecords = dataPasienRecords[0].map(record => {
      // Generate a random 13-digit integer for the nomer_bpjs field
      const nomerBpjs = Math.floor(1000000000000 + Math.random() * 9000000000000);

      return {
        nomer_bpjs: nomerBpjs,
        id_registrasi_pasien: record.id_registrasi_pasien,
        faskes_tingkat: 'Tingkat 1',
        kelas_rawat: 'Kelas 1',
        foto_kartu_bpjs: 'foto-kartu-bpjs.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Insert the data into the data_bpjs table
    return queryInterface.bulkInsert('data_bpjs', dataBpjsRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('data_bpjs', null, {});
  }
};