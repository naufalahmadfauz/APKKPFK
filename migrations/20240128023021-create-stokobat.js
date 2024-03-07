'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stok_obat', {
      id_stok_obat: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      id_obat: {
        type: Sequelize.STRING,
        references: {
          model: 'data_obat',
          key: 'id_obat',
        },
      },
      nomer_batch: Sequelize.STRING,
      expire: Sequelize.DATE,
      jumlah: Sequelize.INTEGER,
      satuan: Sequelize.STRING,
      harga_satuan: Sequelize.INTEGER,
      tipe_obat: Sequelize.STRING,
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
    await queryInterface.dropTable('stok_obat');
  }
};