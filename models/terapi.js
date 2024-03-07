'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class terapi extends Model {
    static associate(models) {
      this.belongsTo(models.RekamMedis, { foreignKey: 'id_rekam_medis', as: 'rekamMedis' });
      this.belongsTo(models.StokObat, { foreignKey: 'id_stok_obat', as: 'stokObat' });
    }
  }
  terapi.init({
    id_terapi: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_rekam_medis: {
      type: DataTypes.STRING,
      references: {
        model: 'rekam_medis',
        key: 'id_rekam_medis'
      }
    },
    id_stok_obat: {
      type: DataTypes.STRING,
      references: {
        model: 'stok_obat',
        key: 'id_stok_obat'
      }
    },
    total: DataTypes.INTEGER,
    dosis: DataTypes.STRING,
    terapi_luar: DataTypes.STRING,
    satuan_luar: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Terapi',
    tableName: 'terapi',
    indexes: [
      {
        unique: true,
        fields: ['id_rekam_medis', 'id_stok_obat']
      }
    ]
  });
  return terapi;
};