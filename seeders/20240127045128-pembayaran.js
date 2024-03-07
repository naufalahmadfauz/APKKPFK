'use strict';
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//   // Fetch all rekam_medis records
//   const rekamMedisRecords = await queryInterface.sequelize.query(
//     `SELECT * FROM "rekam_medis"`
//   );
//
//   // Prepare the data for bulk insert
//   const pembayaranRecords = rekamMedisRecords[0].map((record, index) => {
//     const newDate = new Date(record.createdAt);
//     newDate.setMinutes(newDate.getMinutes() + 5); // Add 5 minutes
//     const randomId = Math.floor(Math.random() * 10000);
//     const idPembayaran = `PB-${randomId}-${index + 1}`; // Unique ID
//     let totalPembayaran = 50000;
//     if (record.hasil_lab !== '-') {
//       totalPembayaran += 30000;
//     }
//
//     return {
//       id_pembayaran: idPembayaran,
//       id_registrasi_pasien: record.id_registrasi_pasien,
//       id_rekam_medis: record.id_rekam_medis,
//       total_pembayaran: totalPembayaran,
//       createdAt: newDate,
//       updatedAt: newDate
//     };
//   });
//
//   // Insert the data into the pembayaran table
//   return queryInterface.bulkInsert('pembayaran', pembayaranRecords, {});
// },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('pembayaran', null, {});
//   }
// };
//===========================
//this one is work VVV

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all rekam_medis records
//     const rekamMedisRecords = await queryInterface.sequelize.query(
//       `SELECT * FROM "rekam_medis"`
//     );
//
//     // Prepare the data for bulk insert
//     const pembayaranRecords = rekamMedisRecords[0].map((record, index) => {
//       const newDate = new Date(record.createdAt);
//       newDate.setMinutes(newDate.getMinutes() + 5); // Add 5 minutes
//       const randomId = Math.floor(Math.random() * 10000);
//       const idPembayaran = `PB-${randomId}-${index + 1}`; // Unique ID
//
//       // Calculate total_pembayaran based on id_dokter and hasil_lab
//       let biayaPengobatan = 0;
//      
//       if (record.id_dokter === 'PDU-8473-1') {
//         biayaPengobatan = 30000;
//       } else if (record.id_dokter === 'PDG-3523-1') {
//         biayaPengobatan = 40000;
//       }
//       if (record.hasil_lab !== '-') {
//         biayaPengobatan += 30000;
//       }
//       return {
//         id_pembayaran: idPembayaran,
//         id_registrasi_pasien: record.id_registrasi_pasien,
//         id_rekam_medis: record.id_rekam_medis,
//         total_pembayaran: totalPembayaran,
//         total_pembayaran_jkn: totalPembayaran,
//         createdAt: newDate,
//         updatedAt: newDate
//       };
//     });
//
//     // Insert the data into the pembayaran table
//     return queryInterface.bulkInsert('pembayaran', pembayaranRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('pembayaran', null, {});
//   }
// };

//===========================

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all rekam_medis records
//     const rekamMedisRecords = await queryInterface.sequelize.query(
//       `SELECT * FROM "rekam_medis"`
//     );
//
//     // Prepare the data for bulk insert
//     const pembayaranRecords = rekamMedisRecords[0].map(async (record, index) => {
//       const newDate = new Date(record.createdAt);
//       newDate.setMinutes(newDate.getMinutes() + 5); // Add 5 minutes
//       const randomId = Math.floor(Math.random() * 10000);
//       const idPembayaran = `PB-${randomId}-${index + 1}`; // Unique ID
//
//       // Fetch dataPasien
//       const dataPasien = await queryInterface.sequelize.query(
//         `SELECT pasien_jkn FROM data_pasien WHERE id_registrasi_pasien = '${record.id_registrasi_pasien}'`
//       );
//
//       let biayaJumlahUmum = 0;
//       let biayaJumlahJkn = 0;
//
//       if (dataPasien[0][0].pasien_jkn === 'Tidak') {
//         if (record.id_dokter === 'PDU-8473-1') {
//           biayaJumlahUmum += 30000;
//         } else if (record.id_dokter === 'PDG-3523-1') {
//           biayaJumlahUmum += 40000;
//         }
//       } else {
//         if (record.id_dokter === 'PDU-8473-1') {
//           biayaJumlahJkn += 30000;
//         } else if (record.id_dokter === 'PDG-3523-1') {
//           biayaJumlahJkn += 40000;
//         }
//       }
//
//       if (record.hasil_lab !== '-') {
//         biayaJumlahUmum += 20000;
//       }
//
//       return {
//         id_pembayaran: idPembayaran,
//         id_registrasi_pasien: record.id_registrasi_pasien,
//         id_rekam_medis: record.id_rekam_medis,
//         total_pembayaran: biayaJumlahUmum,
//         total_pembayaran_jkn: biayaJumlahJkn,
//         createdAt: newDate,
//         updatedAt: newDate
//       };
//     });
//
//     // Insert the data into the pembayaran table
//     return queryInterface.bulkInsert('pembayaran', await Promise.all(pembayaranRecords), {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('pembayaran', null, {});
//   }
// };

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all rekam_medis records
    const rekamMedisRecords = await queryInterface.sequelize.query(
      `SELECT * FROM "rekam_medis"`
    );

    // Prepare the data for bulk insert
    const pembayaranRecords = rekamMedisRecords[0].map(async (record, index) => {
      const newDate = new Date(record.createdAt);
      newDate.setMinutes(newDate.getMinutes() + 5); // Add 5 minutes
      const randomId = Math.floor(Math.random() * 10000);
      const idPembayaran = `PB-${randomId}-${index + 1}`; // Unique ID

      // Fetch dataPasien
      const dataPasien = await queryInterface.sequelize.query(
        `SELECT pasien_jkn FROM data_pasien WHERE id_registrasi_pasien = '${record.id_registrasi_pasien}'`
      );

      let biayaJumlahUmum = 0;
      let biayaJumlahJkn = 0;

      if (dataPasien[0][0].pasien_jkn === 'Tidak') {
        if (record.id_dokter === 'PDU-8473-1') {
          biayaJumlahUmum += 30000;
        } else if (record.id_dokter === 'PDG-3523-1') {
          biayaJumlahUmum += 40000;
        }
      } else {
        if (record.id_dokter === 'PDU-8473-1') {
          biayaJumlahJkn += 30000;
        } else if (record.id_dokter === 'PDG-3523-1') {
          biayaJumlahJkn += 40000;
        }
      }

      if (record.hasil_lab !== '-') {
        biayaJumlahUmum += 20000;
      }

      return {
        id_pembayaran: idPembayaran,
        id_registrasi_pasien: record.id_registrasi_pasien,
        id_rekam_medis: record.id_rekam_medis,
        total_pembayaran: biayaJumlahUmum,
        total_pembayaran_jkn: biayaJumlahJkn,
        createdAt: newDate,
        updatedAt: newDate
      };
    });

    // Insert the data into the pembayaran table
    return queryInterface.bulkInsert('pembayaran', await Promise.all(pembayaranRecords), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pembayaran', null, {});
  }
};