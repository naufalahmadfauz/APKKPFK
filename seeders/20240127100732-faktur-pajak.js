'use strict';
// const { faker } = require('@faker-js/faker');
// or, if desiring a different locale
const { fakerID_ID: faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const fakturPajakRecords = Array.from({ length: 10 }, () => {
    const fakturPajakRecords = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(2023, index, 28);
      const X = Math.floor(Math.random() * 2);
      const AAA = Math.floor(Math.random() * 5) + 1;
      const BB = Math.random() > 0.5 ? 23 : 24;
      const YYYYYYYY = Math.floor(Math.random() * 10000000) + 37000000;
      const nomerSeriFakturPajak = `01${X}${AAA.toString().padStart(3, '0')}${BB}${YYYYYYYY}`;

      const npwpX = Math.floor(Math.random() * 2) + 1;
      const npwpYYY = Math.floor(Math.random() * 400) + 500;
      const npwpZZZ = Math.floor(Math.random() * 200) + 200;
      const npwpA = Math.floor(Math.random() * 9) + 1;
      const npwpBBB = Math.floor(Math.random() * 200) + 300;
      const npwpPtPenjual = `0${npwpX}${npwpYYY}${npwpZZZ}${npwpA}${npwpBBB}000`;

      const namaPtPenjual = faker.science.chemicalElement().name;
      const alamatPtPenjual = faker.location.streetAddress();

      const totalBeforePpn = Math.floor(Math.random() * 4000000) + 1000000;

      // Set the PPn to 30000
      const ppn = 30000;

      // Add the PPn to the total
      let total = totalBeforePpn + ppn;
      total = Math.ceil(total / 100) * 100;

      // Store the total in a variable
      const fakturPajakTotal = total;


      return {
        nomer_seri_faktur_pajak: nomerSeriFakturPajak,
        nama_pt_penjual: namaPtPenjual,
        alamat_pt_penjual: alamatPtPenjual,
        npwp_pt_penjual: npwpPtPenjual,
        ppn: 30000,
        total: fakturPajakTotal,
        createdAt: date,
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('faktur_pajak', fakturPajakRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('faktur_pajak', null, {});
  }
};