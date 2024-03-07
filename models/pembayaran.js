'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.RekamMedis, { foreignKey: 'id_rekam_medis', as: 'rekamMedis' });
      this.belongsTo(models.DataPasien, { foreignKey: 'id_registrasi_pasien', as: 'dataPasien' });
    }
  }
  Pembayaran.init({
    id_pembayaran: {
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
    id_registrasi_pasien: {
      type: DataTypes.STRING,
      references: {
        model: 'data_pasien',
        key: 'id_registrasi_pasien'
      }
    },
    total_pembayaran: DataTypes.INTEGER,
    total_pembayaran_jkn: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pembayaran',
    tableName: 'pembayaran'
  });
  return Pembayaran;
};