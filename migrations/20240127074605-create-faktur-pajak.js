// 'use strict';
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('faktur_pajak', {
//       nomer_seri_faktur_pajak: {
//         allowNull: false,
//         primaryKey: true,
//         type: Sequelize.STRING
//       },
//       nama_pt_penjual: {
//         type: Sequelize.STRING
//       },
//       alamat_pt_penjual: {
//         type: Sequelize.STRING
//       },
//       npwp_pt_penjual: {
//         type: Sequelize.STRING
//       },
//       ppn: {
//         type: Sequelize.INTEGER
//       },
//       total: {
//         type: Sequelize.INTEGER
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
//     await queryInterface.dropTable('faktur_pajak');
//   }
// };

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('faktur_pajak', {
      nomer_seri_faktur_pajak: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nama_pt_penjual: {
        type: Sequelize.STRING
      },
      alamat_pt_penjual: {
        type: Sequelize.STRING
      },
      npwp_pt_penjual: {
        type: Sequelize.STRING
      },
      ppn: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('faktur_pajak');
  }
};