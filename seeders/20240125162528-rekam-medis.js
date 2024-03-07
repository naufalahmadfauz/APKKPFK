'use strict';

const gejalaList = ['Pusing', 'Mual', 'Muntah', 'Lemah', 'Letih', 'Lesu'];
const hasilLabList = ['-', 'Gula darah normal'];

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//   // Fetch all rekam_medis_awal records
//   const rekamMedisAwalRecords = await queryInterface.sequelize.query(
//     `SELECT * FROM "rekam_medis_awal"`
//   );
//
//   // Prepare the data for bulk insert
//   const rekamMedisRecords = rekamMedisAwalRecords[0].map((record, index) => {
//     const newDate = new Date(record.createdAt);
//     newDate.setMinutes(newDate.getMinutes() + 20); // Add 20 minutes
//     const randomId = Math.floor(Math.random() * 10000);
//     const idRekamMedis = `RM-${randomId}-${index + 1}`; // Unique ID
//     const randomHasilLab = hasilLabList[Math.floor(Math.random() * hasilLabList.length)];
//     const randomGejala = gejalaList[Math.floor(Math.random() * gejalaList.length)];
//
//     return {
//       id_rekam_medis: idRekamMedis,
//       id_registrasi_pasien: record.id_registrasi_pasien,
//       id_rekam_medis_awal: record.id_rekam_medis_awal,
//      
//       hasil_lab: randomHasilLab,
//       gejala: randomGejala,
//       createdAt: newDate,
//       updatedAt: newDate
//     };
//   });
//
//   // Insert the data into the rekam_medis table
//   return queryInterface.bulkInsert('rekam_medis', rekamMedisRecords, {});
// },
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('rekam_medis', null, {});
//   }
// };
module.exports = {
  up: async (queryInterface, Sequelize) => {
  // Fetch all rekam_medis_awal records
  // Fetch all rekam_medis_awal records
const rekamMedisAwalRecords = await queryInterface.sequelize.query(
  `SELECT * FROM "rekam_medis_awal"`
);

// Prepare the data for bulk insert
const rekamMedisRecords = rekamMedisAwalRecords[0].map((record, index) => {
  const newDate = new Date(record.createdAt);
  newDate.setMinutes(newDate.getMinutes() + 20); // Add 20 minutes
  const randomId = Math.floor(Math.random() * 10000);
  const idRekamMedis = `RM-${randomId}-${index + 1}`; // Unique ID
  const randomHasilLab = hasilLabList[Math.floor(Math.random() * hasilLabList.length)];
  const randomGejala = gejalaList[Math.floor(Math.random() * gejalaList.length)];

  // Randomly select a doctor ID
  const dokterIds = ['PDG-3523-1', 'PDU-8473-1'];
  const randomDokterId = dokterIds[Math.floor(Math.random() * dokterIds.length)];

  return {
    id_rekam_medis: idRekamMedis,
    id_registrasi_pasien: record.id_registrasi_pasien,
    id_rekam_medis_awal: record.id_rekam_medis_awal,
    id_dokter: randomDokterId, // Add the doctor ID here
    hasil_lab: randomHasilLab,
    gejala: randomGejala,
    createdAt: newDate,
    updatedAt: newDate
  };
});

// Insert the data into the rekam_medis table
return queryInterface.bulkInsert('rekam_medis', rekamMedisRecords, {});
},
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rekam_medis', null, {});
  }
};