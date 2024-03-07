'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class penguranganObat extends Model {
    static associate(models) {
      this.hasMany(models.detailpenguranganobat, { foreignKey: 'id_pengurangan_obat', as: 'detailPenguranganObat' });
    }
  };
  penguranganObat.init({
    id_pengurangan_obat: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    status_pengurangan_obat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'penguranganObat',
    tableName: 'pengurangan_obat',
  });
  return penguranganObat;
};