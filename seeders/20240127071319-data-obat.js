'use strict';
const readExcelFile = require('read-excel-file/node');
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Read the contents of the Excel file
    const excelPath = path.join(__dirname, '/namaObat.xlsx')
    
    const rows = await readExcelFile(excelPath);

    // Prepare the data for bulk insert
    const dataObatRecords = rows.map((row, index) => {
      // Generate a random 4-digit number for the XXXX part of id_obat
      const randomNum = Math.floor(Math.random() * 9000) + 1000;

      // Generate the id_obat value following the template O-XXXX-Y
      const idObat = `O-${randomNum}-${index + 1}`;

      // Get the nama_obat value from the Excel file
      const namaObat = row[0]; // Adjust this if the nama_obat value is not in the first column

      return {
        id_obat: idObat,
        nama_obat: namaObat,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Insert the data into the data_obat table
    return queryInterface.bulkInsert('data_obat', dataObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('data_obat', null, {});
  }
};