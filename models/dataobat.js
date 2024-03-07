'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dataObat extends Model {
    static associate(models) {
      this.hasMany(models.detailPengadaanObat, {foreignKey: 'id_obat',as: 'detailPengadaanObat'});
      this.hasMany(models.StokObat, {foreignKey: 'id_obat', as: 'stokObat'});
    }
  };
  dataObat.init({
    id_obat: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nama_obat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dataObat',
    tableName: 'data_obat',
  });
  return dataObat;
};