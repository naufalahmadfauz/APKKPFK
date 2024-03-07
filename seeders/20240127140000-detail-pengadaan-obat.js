// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_pengadaan_obat FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     pengadaanObatRecords[0].forEach((record) => {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//       for (let i = 0; i < recordCount; i++) {
//         // Generate the id_detail_pengadaan_obat value
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         // Randomize other fields
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//         const hargaSatuan = Math.floor(Math.random() * 5001) + 5000;
//         const total = jumlah * hargaSatuan;
//
//         // Randomly select an id_obat
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch.toString(),
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: total,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     });
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };
//
// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_pengadaan_obat FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     pengadaanObatRecords[0].forEach((record) => {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//       for (let i = 0; i < recordCount; i++) {
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//
//         const hargaSatuan = Math.floor(Math.random() * 5001) + 5000;
//
//         const total = jumlah * hargaSatuan;
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch,
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: total,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     });
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };
//
// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_pengadaan_obat, nomer_seri_faktur_pajak FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     for (const record of pengadaanObatRecords[0]) {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Fetch total from faktur_pajak for the current id_pengadaan_obat
//       const fakturPajakRecord = await queryInterface.sequelize.query(
//         `SELECT total FROM faktur_pajak WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
//       );
//
//       const total = fakturPajakRecord[0][0].total;
//
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//       for (let i = 0; i < recordCount; i++) {
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//
//         // Adjust jumlah and harga_satuan to match the total from faktur_pajak
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//         const hargaSatuan = Math.floor(total / jumlah);
//
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch.toString(),
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: total,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };
//
// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_pengadaan_obat, nomer_seri_faktur_pajak FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     for (const record of pengadaanObatRecords[0]) {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Fetch total from faktur_pajak for the current id_pengadaan_obat
//       const fakturPajakRecord = await queryInterface.sequelize.query(
//         `SELECT total FROM faktur_pajak WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
//       );
//
//       const total = fakturPajakRecord[0][0].total;
//
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//       // Calculate the average total for each record
//       const averageTotal = Math.floor(total / recordCount);
//
//       for (let i = 0; i < recordCount; i++) {
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//
//         // Adjust jumlah and harga_satuan to match the average total
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//         let hargaSatuan = Math.floor(averageTotal / jumlah);
//         hargaSatuan = Math.round(hargaSatuan / 100) * 100;
//
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch.toString(),
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: jumlah * hargaSatuan,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };
//
// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//         `SELECT id_pengadaan_obat, nomer_seri_faktur_pajak FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//         `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     for (const record of pengadaanObatRecords[0]) {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Fetch total from faktur_pajak for the current id_pengadaan_obat
//       const fakturPajakRecord = await queryInterface.sequelize.query(
//           `SELECT total FROM faktur_pajak WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
//       );
//
//       const total = fakturPajakRecord[0][0].total;
//
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//       // Calculate the total for each record
//       const detailPengadaanObatTotal = Math.floor(total / recordCount);
//
//       for (let i = 0; i < recordCount; i++) {
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//
//         // Adjust jumlah and harga_satuan to match the total from faktur_pajak
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//         const hargaSatuan = Math.floor(detailPengadaanObatTotal / jumlah);
//
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch.toString(),
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: detailPengadaanObatTotal,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };

// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//         `SELECT id_pengadaan_obat, nomer_seri_faktur_pajak FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//         `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     for (const record of pengadaanObatRecords[0]) {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Fetch total from faktur_pajak for the current id_pengadaan_obat
//       const fakturPajakRecord = await queryInterface.sequelize.query(
//           `SELECT total FROM faktur_pajak WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
//       );
//
//       const total = fakturPajakRecord[0][0].total;
//
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//       // Calculate the total for each record
//       let detailPengadaanObatTotal = Math.floor(total / recordCount);
//
//       // Round detailPengadaanObatTotal to the nearest hundred
//       detailPengadaanObatTotal = Math.round(detailPengadaanObatTotal / 100) * 100;
//
//       for (let i = 0; i < recordCount; i++) {
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//
//         // Adjust jumlah and harga_satuan to match the total from faktur_pajak
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//         const hargaSatuan = Math.floor(detailPengadaanObatTotal / jumlah);
//
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch.toString(),
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: detailPengadaanObatTotal,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };

// faktur_pajak seed file
// 'use strict';
// const { fakerID_ID: faker } = require('@faker-js/faker');
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const fakturPajakRecords = Array.from({ length: 10 }, () => {
//       // ... other code ...
//
//       // Randomize the total before PPn between 1000000 to 5000000
//       const totalBeforePpn = Math.floor(Math.random() * 4000000) + 1000000;
//
//       // Set the PPn to 30000
//       const ppn = 30000;
//
//       // Add the PPn to the total
//       let total = totalBeforePpn + ppn;
//
//       // Round up the total to the nearest hundred
//       total = Math.ceil(total / 100) * 100;
//
//       // Store the total in a variable
//       const fakturPajakTotal = total;
//
//       return {
//         // ... other code ...
//         ppn: ppn,
//         total: fakturPajakTotal,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };
//     });
//
//     return queryInterface.bulkInsert('faktur_pajak', fakturPajakRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('faktur_pajak', null, {});
//   }
// };
//
// detail_pengadaan_obat seed file
// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
//     const pengadaanObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_pengadaan_obat, nomer_seri_faktur_pajak FROM pengadaan_obat`
//     );
//     const dataObatRecords = await queryInterface.sequelize.query(
//       `SELECT id_obat FROM data_obat`
//     );
//
//     // Prepare the data for bulk insert
//     const detailPengadaanObatRecords = [];
//
//     for (const record of pengadaanObatRecords[0]) {
//       const idPengadaanObat = record.id_pengadaan_obat;
//       const Y = idPengadaanObat.split('-')[2];
//
//       // Fetch total from faktur_pajak for the current id_pengadaan_obat
//       // const fakturPajakRecord = await queryInterface.sequelize.query(
//       //   `SELECT total FROM faktur_pajak WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
//       // );
//       const fakturPajakRecord = await queryInterface.sequelize.query(
//           `SELECT total, ppn FROM faktur_pajak WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
//       );
//       const total = fakturPajakRecord[0][0].total;
//       const ppn = fakturPajakRecord[0][0].ppn;
//       // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
//       const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records
//
//
//       // Calculate the total for each record
//       let detailPengadaanObatTotal = Math.floor((total - ppn) / recordCount);
//
//       // Round detailPengadaanObatTotal to the nearest hundred
//       detailPengadaanObatTotal = Math.round(detailPengadaanObatTotal / 100) * 100;
//       for (let i = 0; i < recordCount; i++) {
//         const randomNum = Math.floor(Math.random() * 9000) + 1000;
//         const idDetailPengadaanObat = `${randomNum}-${Y}`;
//
//         const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;
//
//         const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;
//
//         const expire = new Date();
//         expire.setFullYear(expire.getFullYear() + 1);
//
//         // Adjust jumlah and harga_satuan to match the total from faktur_pajak
//         const jumlah = Math.floor(Math.random() * 51) + 50;
//         const hargaSatuan = Math.floor(detailPengadaanObatTotal / jumlah);
//
//         const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];
//
//         detailPengadaanObatRecords.push({
//           id_detail_pengadaan_obat: idDetailPengadaanObat,
//           id_pengadaan_obat: idPengadaanObat,
//           id_obat: idObat,
//           nomer_batch: nomerBatch.toString(),
//           expire: expire,
//           jumlah: jumlah,
//           satuan: satuan,
//           harga_satuan: hargaSatuan,
//           total: detailPengadaanObatTotal,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         });
//       }
//     }
//
//     // Insert the data into the detail_pengadaan_obat table
//     return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
//   },
//
//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
//   }
// };

// detail_pengadaan_obat seed file
// detail_pengadaan_obat seed file
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all id_pengadaan_obat from the pengadaan_obat table and id_obat from data_obat table
    const pengadaanObatRecords = await queryInterface.sequelize.query(
      `SELECT id_pengadaan_obat, nomer_seri_faktur_pajak FROM pengadaan_obat`
    );
    const dataObatRecords = await queryInterface.sequelize.query(
      `SELECT id_obat FROM data_obat`
    );

    // Prepare the data for bulk insert
    const detailPengadaanObatRecords = [];

    for (const record of pengadaanObatRecords[0]) {
      const idPengadaanObat = record.id_pengadaan_obat;
      const Y = idPengadaanObat.split('-')[2];

      // Fetch total and ppn from faktur_pajak for the current id_pengadaan_obat
      const fakturPajakRecord = await queryInterface.sequelize.query(
          `SELECT total, ppn
           FROM faktur_pajak
           WHERE nomer_seri_faktur_pajak = '${record.nomer_seri_faktur_pajak}'`
      );

      const total = fakturPajakRecord[0][0].total;
      const ppn = fakturPajakRecord[0][0].ppn;

      // Generate multiple detail_pengadaan_obat records for each id_pengadaan_obat
      const recordCount = Math.floor(Math.random() * 10) + 1; // Randomize the number of records

      // Calculate the total for each record
      let detailPengadaanObatTotal = Math.floor((total - ppn) / recordCount);

      // Round detailPengadaanObatTotal to the nearest hundred
      detailPengadaanObatTotal = Math.round(detailPengadaanObatTotal / 100) * 100;

      let totalDetailPengadaanObat = 0;

      for (let i = 0; i < recordCount; i++) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const idDetailPengadaanObat = `${randomNum}-${Y}`;

        const idObat = dataObatRecords[0][Math.floor(Math.random() * dataObatRecords[0].length)].id_obat;

        const nomerBatch = Math.floor(Math.random() * 9000000) + 1000000;

        const expire = new Date();
        expire.setFullYear(expire.getFullYear() + 1);

        // Adjust jumlah and harga_satuan to match the total from faktur_pajak
        const jumlah = Math.floor(Math.random() * 51) + 50;
        const hargaSatuan = Math.floor(detailPengadaanObatTotal / jumlah);

        const satuan = ['Botol', 'Strip', 'Pcs'][Math.floor(Math.random() * 3)];

        // Adjust the total for the last record to make up for the rounding error
        if (i === recordCount - 1) {
          detailPengadaanObatTotal = total - ppn - totalDetailPengadaanObat;
        }

        totalDetailPengadaanObat += detailPengadaanObatTotal;

        detailPengadaanObatRecords.push({
          id_detail_pengadaan_obat: idDetailPengadaanObat,
          id_pengadaan_obat: idPengadaanObat,
          id_obat: idObat,
          nomer_batch: nomerBatch.toString(),
          expire: expire,
          jumlah: jumlah,
          satuan: satuan,
          harga_satuan: hargaSatuan,
          total: detailPengadaanObatTotal,
          status_pengadaan: 'Disetujui',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Insert the data into the detail_pengadaan_obat table
    return queryInterface.bulkInsert('detail_pengadaan_obat', detailPengadaanObatRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('detail_pengadaan_obat', null, {});
  }
};