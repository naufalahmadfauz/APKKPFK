'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('terapi', {
      id_terapi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_rekam_medis: {
        type: Sequelize.STRING,
        references: {
          model: 'rekam_medis',
          key: 'id_rekam_medis'
        }
      },
      id_stok_obat: {
        type: Sequelize.STRING,
        references: {
          model: 'stok_obat',
          key: 'id_stok_obat'
        }
      },
      total: {
        type: Sequelize.INTEGER
      },
      dosis: {
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
    await queryInterface.addIndex('terapi', ['id_rekam_medis', 'id_stok_obat'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('terapi');
  }
};