'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detail_pengadaan_obat', {
      id_detail_pengadaan_obat: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_pengadaan_obat: {
        type: Sequelize.STRING,
        references: {
          model: 'pengadaan_obat',
          key: 'id_pengadaan_obat',
        },
      },
      id_obat: {
        type: Sequelize.STRING,
        references: {
          model: 'data_obat',
          key: 'id_obat',
        },
      },
      nomer_batch: {
        type: Sequelize.STRING
      },
      expire: {
        type: Sequelize.DATE
      },
      jumlah: {
        type: Sequelize.INTEGER
      },
      satuan: {
        type: Sequelize.STRING
      },
      harga_satuan: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      status_pengadaan: {
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

    // Add unique constraint
    await queryInterface.addConstraint('detail_pengadaan_obat', {
      fields: ['id_pengadaan_obat', 'id_obat'],
      type: 'unique',
      name: 'detail_pengadaan_obat_unique_constraint'
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Remove unique constraint
    await queryInterface.removeConstraint('detail_pengadaan_obat', 'detail_pengadaan_obat_unique_constraint');

    await queryInterface.dropTable('detail_pengadaan_obat');
  }
};