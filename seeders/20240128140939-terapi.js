'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const rekamMedisRecords = await queryInterface.sequelize.query(
      `SELECT id_rekam_medis FROM rekam_medis`
    );

    const terapiRecords = [];
    const date = new Date(2024, 0, 15);

    for (const record of rekamMedisRecords[0]) {
      const idRekamMedis = record.id_rekam_medis;
      const usedStokObatIds = [];

      for (let i = 0; i < 2; i++) {
        let stokObatRecord;
        do {
          stokObatRecord = await queryInterface.sequelize.query(
            `SELECT id_stok_obat, satuan FROM stok_obat WHERE jumlah > 1 AND id_stok_obat NOT IN ('${usedStokObatIds.join("','")}') ORDER BY RANDOM() LIMIT 1`
          );
        } while (stokObatRecord[0].length === 0);

        const idStokObat = stokObatRecord[0][0].id_stok_obat;
        const satuan = stokObatRecord[0][0].satuan;
        usedStokObatIds.push(idStokObat);

        let dosis;
        if (satuan === 'Botol') {
          dosis = '2x1 Pagi dan sore 1 sendok makan';
        } else if (satuan === 'Strip') {
          dosis = '1 tablet setiap malam';
        } else {
          dosis = '1 kali sehari';
        }

        terapiRecords.push({
          id_terapi: `${idRekamMedis}-${i}`,
          id_rekam_medis: idRekamMedis,
          id_stok_obat: idStokObat,
          total: 2,
          dosis: dosis,
          createdAt: date,
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('terapi', terapiRecords, {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('terapi', null, {});
  }
};

// 'use strict';

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     const rekamMedisRecords = await queryInterface.sequelize.query(
//       `SELECT id_rekam_medis FROM rekam_medis`
//     );
//
//     const terapiRecords = [];
//     const createdAt = new Date(2023, 11, 27);
//
//     for (const record of rekamMedisRecords[0]) {
//       const idRekamMedis = record.id_rekam_medis;
//       const usedStokObatIds = [];
//       const dataPasien = await queryInterface.sequelize.query(
//           `SELECT pasien_jkn FROM data_pasien WHERE id_registrasi_pasien = '${idRekamMedis}'`
//       );
//       for (let i = 0; i < 2; i++) {
//         let stokObatRecord;
//         do {
//           stokObatRecord = await queryInterface.sequelize.query(
//             `SELECT id_stok_obat, satuan FROM stok_obat WHERE jumlah > 1 AND id_stok_obat NOT IN ('${usedStokObatIds.join("','")}') ORDER BY RANDOM() LIMIT 1`
//           );
//         } while (stokObatRecord[0].length === 0);
//
//         const idStokObat = stokObatRecord[0][0].id_stok_obat;
//         const satuan = stokObatRecord[0][0].satuan;
//         usedStokObatIds.push(idStokObat);
//
//         let dosis;
//         if (satuan === 'Botol') {
//           dosis = '2x1 Pagi dan sore 1 sendok makan';
//         } else if (satuan === 'Strip') {
//           dosis = '1 tablet setiap malam';
//         } else {
//           dosis = '1 kali sehari';
//         }
//
//         // Generate a random 4-digit number
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//
//         // Extract the last number from id_rekam_medis
//         const lastNum = idRekamMedis.slice(-1);
//
//         // Construct id_terapi
//         const id_terapi = `${randomNum}-${lastNum}`;
//
//         terapiRecords.push({
//           id_terapi: id_terapi,
//           id_rekam_medis: idRekamMedis,
//           id_stok_obat: idStokObat,
//           total: 2,
//           dosis: dosis,
//           createdAt: createdAt,
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     return queryInterface.bulkInsert('terapi', terapiRecords, {});
//   },
//
//   async down (queryInterface, Sequelize) {
//     return queryInterface.bulkDelete('terapi', null, {});
//   }
// };
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     const rekamMedisRecords = await queryInterface.sequelize.query(
//         `SELECT id_rekam_medis FROM rekam_medis`
//     );
//
//     const terapiRecords = [];
//     const createdAt = new Date(2023, 11, 27);
//
//     // Fetch all stok_obat records that have tipe_obat 'jkn'
//     const jknStokObatRecords = await queryInterface.sequelize.query(
//         `SELECT id_stok_obat FROM stok_obat WHERE tipe_obat = 'jkn'`
//     );
//
//     for (const record of rekamMedisRecords[0]) {
//       const idRekamMedis = record.id_rekam_medis;
//       const usedStokObatIds = [];
//
//       for (let i = 0; i < 2; i++) {
//         let stokObatRecord;
//         do {
//           // If data_pasien.pasien_jkn is 'Tidak', exclude stok_obat records that have tipe_obat 'jkn'
//           let excludeJknStokObatIds = [];
//           if (dataPasien[0][0] && dataPasien[0][0].hasOwnProperty('pasien_jkn')) {
//             excludeJknStokObatIds = dataPasien[0][0].pasien_jkn === 'Tidak' ? jknStokObatRecords[0].map(record => record.id_stok_obat) : [];
//           }
//           stokObatRecord = await queryInterface.sequelize.query(
//               `SELECT id_stok_obat, satuan FROM stok_obat WHERE jumlah > 1 AND id_stok_obat NOT IN ('${usedStokObatIds.concat(excludeJknStokObatIds).join("','")}') ORDER BY RANDOM() LIMIT 1`
//           );
//         } while (stokObatRecord[0].length === 0);
//
//
//         const idStokObat = stokObatRecord[0][0].id_stok_obat;
//         const satuan = stokObatRecord[0][0].satuan;
//         usedStokObatIds.push(idStokObat);
//
//         let dosis;
//         if (satuan === 'Botol') {
//           dosis = '2x1 Pagi dan sore 1 sendok makan';
//         } else if (satuan === 'Strip') {
//           dosis = '1 tablet setiap malam';
//         } else {
//           dosis = '1 kali sehari';
//         }
//
//         // Generate a random 4-digit number
//         const randomNum = Math.floor(1000 + Math.random() * 9000);
//
//         // Extract the last number from id_rekam_medis
//         const lastNum = idRekamMedis.slice(-1);
//
//         // Construct id_terapi
//         const id_terapi = `${randomNum}-${lastNum}`;
//
//         terapiRecords.push({
//           id_terapi: id_terapi,
//           id_rekam_medis: idRekamMedis,
//           id_stok_obat: idStokObat,
//           total: 2,
//           dosis: dosis,
//           createdAt: createdAt,
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     return queryInterface.bulkInsert('terapi', terapiRecords, {});
//   },
//
//   async down (queryInterface, Sequelize) {
//     return queryInterface.bulkDelete('terapi', null, {});
//   }
// };


