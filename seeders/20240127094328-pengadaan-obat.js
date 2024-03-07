'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all nomer_seri_faktur_pajak from the faktur_pajak table
    const fakturPajakRecords = await queryInterface.sequelize.query(
      `SELECT nomer_seri_faktur_pajak FROM faktur_pajak`
    );
    
    // Prepare the data for bulk insert
    const pengadaanObatRecords = fakturPajakRecords[0].map((record, index) => {
      // Create a new date object for the start date
      // const date = new Date('2023-01-01');
      const date = new Date(2023, index, 15);

      // Increment the date by the index
      // date.setDate(date.getDate() + index);
      // Generate the id_pengadaan_obat value following the template PO-XXXX-Y
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const idPengadaanObat = `PO-${randomNum}-${index + 1}`;

      // Use the nomer_seri_faktur_pajak from the fetched list
      const nomerSeriFakturPajak = record.nomer_seri_faktur_pajak;

      // Randomize the status_pengadaan_obat value between 'Umum' and 'jkn'
      const jenisPengadaanObat = Math.random() > 0.5 ? 'Umum' : 'JKN';

      // Set the status_pengadaan_obat value to 'Diterima'
      const statusPengadaanObat = 'Diterima';

      return {
        id_pengadaan_obat: idPengadaanObat,
        nomer_seri_faktur_pajak: nomerSeriFakturPajak,
        status_pengadaan_obat: statusPengadaanObat,
        jenis_pengadaan_obat: jenisPengadaanObat,
        createdAt: date,
        updatedAt: new Date()
      };
    });

    // Insert the data into the pengadaan_obat table
    return queryInterface.bulkInsert('pengadaan_obat', pengadaanObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pengadaan_obat', null, {});
  }
};