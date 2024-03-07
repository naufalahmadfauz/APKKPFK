// 'use strict';
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('pengadaan_obat', {
//       id_pengadaan_obat: {
//         allowNull: false,
//         primaryKey: true,
//         type: Sequelize.STRING
//       },
//       nomer_seri_faktur_pajak: {
//         type: Sequelize.STRING
//       },
//       status_pengadaan_obat: {
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('pengadaan_obat');
//   }
// };
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pengadaan_obat', {
      id_pengadaan_obat: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nomer_seri_faktur_pajak: {
        type: Sequelize.STRING,
        references: {
          model: 'faktur_pajak', // name of Target model
          key: 'nomer_seri_faktur_pajak', // key in Target model that we're referencing
        },
      },
      status_pengadaan_obat: {
        type: Sequelize.STRING
      },
      jenis_pengadaan_obat: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pengadaan_obat');
  }
};
//
// 20240127074605-create-pengadaan-obat
// 20240127075533-create-faktur-pajak.js