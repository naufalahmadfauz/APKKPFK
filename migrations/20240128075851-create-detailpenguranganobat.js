'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detail_pengurangan_obat', {
      id_detail_pengurangan_obat: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      id_pengurangan_obat: {
        type: Sequelize.STRING,
        references: {
          model: 'pengurangan_obat',
          key: 'id_pengurangan_obat',
        },
      },
      id_stok_obat: {
        type: Sequelize.STRING,
        references: {
          model: 'stok_obat',
          key: 'id_stok_obat',
        },
      },
      jumlah: Sequelize.INTEGER,
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      
    });
    await queryInterface.addIndex('detail_pengurangan_obat', ['id_pengurangan_obat', 'id_stok_obat'], {
      unique: true,
      name: 'compositeIndex'
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('detail_pengurangan_obat');
  }
};