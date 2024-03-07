'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detailpenguranganobat extends Model {
    static associate(models) {
      this.belongsTo(models.penguranganObat, { foreignKey: 'id_pengurangan_obat', as: 'penguranganObat' });
      this.belongsTo(models.StokObat, { foreignKey: 'id_stok_obat', as: 'stokObat' });
    }
  }
  detailpenguranganobat.init({
    id_detail_pengurangan_obat: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_pengurangan_obat: {
      type: DataTypes.STRING,
      references: {
        model: 'pengurangan_obat', // name of Target model
        key: 'id_pengurangan_obat', // key in Target model that we're referencing
      },
    },
    id_stok_obat: {
      type: DataTypes.STRING,
      references: {
        model: 'stok_obat', // name of Target model
        key: 'id_stok_obat', // key in Target model that we're referencing
      },
    },
    jumlah: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'detailpenguranganobat',
    tableName: 'detail_pengurangan_obat',
    indexes: [
      {
        unique: true,
        fields: ['id_pengurangan_obat', 'id_stok_obat']
      }
    ]
  });
  return detailpenguranganobat;
};

// I need to create a seed file for pengurangan_obat and detail_pengurangan_obat. for pengurangan_obat the id_pengurangan_obat should follow PGO-XXXX-Y as the XXXX is 4 random number and Y is number of how many record in pengurangan_obat. for status_pengurangan)obat set it to 'Disetujui'. for detail_pengurangan_obat