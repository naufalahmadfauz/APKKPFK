'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detailPengadaanObat extends Model {
    static associate(models) {
      this.belongsTo(models.pengadaanObat, {
        foreignKey: 'id_pengadaan_obat',
        as: 'pengadaanObat'
      });
      this.belongsTo(models.dataObat, {
        foreignKey: 'id_obat',
        as: 'dataObat'
      });
    }
  };
  detailPengadaanObat.init({
    id_detail_pengadaan_obat: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_pengadaan_obat: {
      type: DataTypes.STRING,
      references: {
        model: 'pengadaan_obat',
        key: 'id_pengadaan_obat',
      },
    },
    id_obat: {
      type: DataTypes.STRING,
      references: {
        model: 'data_obat',
        key: 'id_obat',
      },
    },
    nomer_batch: DataTypes.STRING,
    expire: DataTypes.DATE,
    jumlah: DataTypes.INTEGER,
    satuan: DataTypes.STRING,
    harga_satuan: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status_pengadaan: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'detailPengadaanObat',
    tableName: 'detail_pengadaan_obat',
    indexes: [
      {
        unique: true,
        fields: ['id_pengadaan_obat', 'id_obat']
      }
    ]
  });
  return detailPengadaanObat;
};