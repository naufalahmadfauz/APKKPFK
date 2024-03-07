// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('nomer_antrian', {
//       id_antrian: {
//         type: Sequelize.STRING,
//         primaryKey: true,
//       },
//       id_registrasi_pasien: {
//         type: Sequelize.STRING
//       },
//       id_dokter: {
//         type: Sequelize.STRING
//       },
//       nomer_antrian: {
//         type: Sequelize.INTEGER
//       },
//       status_antrian: {
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
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('nomer_antrian');
//   }
// };

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nomer_antrian', {
      id_antrian: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      id_registrasi_pasien: {
        type: Sequelize.STRING,
        references: {
          model: 'data_pasien', // name of Target model
          key: 'id_registrasi_pasien', // key in Target model that we're referencing
        },
      },
      id_dokter: {
        type: Sequelize.STRING,
        references: {
          model: 'profil_dokter', // name of Target model
          key: 'id_dokter', // key in Target model that we're referencing
        },
      },
      nomer_antrian: {
        type: Sequelize.INTEGER
      },
      status_antrian: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nomer_antrian');
  }
};