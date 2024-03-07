'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RekamMedisAwal extends Model {
    static associate(models) {
      this.belongsTo(models.DataPasien, { foreignKey: 'id_registrasi_pasien', as: 'dataPasien' });
      this.hasOne(models.RekamMedis, { foreignKey: 'id_rekam_medis_awal', as: 'rekamMedis' });
    }
  }
  RekamMedisAwal.init({
    id_rekam_medis_awal: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_registrasi_pasien: {
      type: DataTypes.STRING,
      references: {
        model: 'data_pasien',
        key: 'id_registrasi_pasien'
      }
    },
    berat_badan: DataTypes.INTEGER,
    tinggi_badan: DataTypes.INTEGER,
    tekanan_darah_sistolik: DataTypes.INTEGER,
    tekanan_darah_diastolik: DataTypes.INTEGER,
    suhu_badan: DataTypes.INTEGER,
    riwayat_penyakit: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RekamMedisAwal',
    tableName: 'rekam_medis_awal'
  });
  return RekamMedisAwal;
};