// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//   // Fetch all data_pasien records
//   const dataPasienRecords = await queryInterface.sequelize.query(
//     `SELECT "id_registrasi_pasien" FROM "data_pasien"`
//   );
//
//   // Prepare the data for bulk insert
//   const rekamMedisAwalRecords = [];
//   const date = new Date();
//   date.setFullYear(date.getFullYear(), 0, 1); // Set date to 1st January of the current year
//
//   for (let i = 0; i < 31; i++) { // Loop through the number of days in January
//     dataPasienRecords[0].forEach((record, index) => {
//       const newDate = new Date(date.getTime());
//       newDate.setMinutes(newDate.getMinutes() + (index * 5));
//       const randomId = Math.floor(Math.random() * 10000);
//       const idRekamMedisAwal = `RMA-${randomId.toString().padStart(4, '0')}-${index + 1}`;
//       const randomBeratBadan = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
//       const randomTinggiBadan = Math.floor(Math.random() * (180 - 160 + 1)) + 160;
//       const randomTekananDarahSistolik = Math.floor(Math.random() * (120 - 100 + 1)) + 100;
//       const randomTekananDarahDiastolik = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
//       const randomSuhuBadan = Math.floor(Math.random() * (38 - 36 + 1)) + 36;
//
//       rekamMedisAwalRecords.push({
//         id_rekam_medis_awal: idRekamMedisAwal,
//         id_registrasi_pasien: record.id_registrasi_pasien,
//         berat_badan: randomBeratBadan,
//         tinggi_badan: randomTinggiBadan,
//         tekanan_darah_sistolik: randomTekananDarahSistolik,
//         tekanan_darah_diastolik: randomTekananDarahDiastolik,
//         suhu_badan: randomSuhuBadan,
//         riwayat_penyakit: '-',
//         createdAt: newDate,
//         updatedAt: newDate
//       });
//     });
//
//     date.setDate(date.getDate() + 1); // Increment the date by one day
//   }
//
//   // Insert the data into the rekam_medis_awal table
//   return queryInterface.bulkInsert('rekam_medis_awal', rekamMedisAwalRecords, {});
// },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('rekam_medis_awal', null, {});
//   }
// };
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  // Fetch all data_pasien records
  const dataPasienRecords = await queryInterface.sequelize.query(
    `SELECT "id_registrasi_pasien" FROM "data_pasien"`
  );

  // Prepare the data for bulk insert
  const rekamMedisAwalRecords = [];
  const date = new Date();
  date.setFullYear(date.getFullYear(), 0, 1); // Set date to 1st January of the current year

  for (let i = 0; i < 31; i++) { // Loop through the number of days in January
    dataPasienRecords[0].forEach((record, index) => {
      const newDate = new Date(date.getTime());
      newDate.setMinutes(newDate.getMinutes() + (index * 5));
      const randomId = Math.floor(Math.random() * 10000);
      const idRekamMedisAwal = `RMA-${randomId.toString().padStart(4, '0')}-${index + 1}`;
      const randomBeratBadan = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
      const randomTinggiBadan = Math.floor(Math.random() * (180 - 160 + 1)) + 160;
      const randomTekananDarahSistolik = Math.floor(Math.random() * (120 - 100 + 1)) + 100;
      const randomTekananDarahDiastolik = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
      const randomSuhuBadan = Math.floor(Math.random() * (38 - 36 + 1)) + 36;

      rekamMedisAwalRecords.push({
        id_rekam_medis_awal: idRekamMedisAwal,
        id_registrasi_pasien: record.id_registrasi_pasien,
        berat_badan: randomBeratBadan,
        tinggi_badan: randomTinggiBadan,
        tekanan_darah_sistolik: randomTekananDarahSistolik,
        tekanan_darah_diastolik: randomTekananDarahDiastolik,
        suhu_badan: randomSuhuBadan,
        riwayat_penyakit: '-',
        createdAt: newDate,
        updatedAt: newDate
      });
    });

    date.setDate(date.getDate() + 1); // Increment the date by one day
  }

  // Insert the data into the rekam_medis_awal table
  return queryInterface.bulkInsert('rekam_medis_awal', rekamMedisAwalRecords, {});
},

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rekam_medis_awal', null, {});
  }
};